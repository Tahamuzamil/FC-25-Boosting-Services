using Discord;
using Discord.WebSocket;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Services;

public class DiscordBotService : IDiscordBotService, IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _config;
    private readonly ILogger<DiscordBotService> _logger;
    private DiscordSocketClient? _client;

    public DiscordBotService(
        IServiceProvider serviceProvider,
        IConfiguration config,
        ILogger<DiscordBotService> logger)
    {
        _serviceProvider = serviceProvider;
        _config = config;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var token = _config["Discord:BotToken"];
        if (string.IsNullOrWhiteSpace(token) || token == "YOUR_DISCORD_BOT_TOKEN")
        {
            _logger.LogWarning("Discord:BotToken is not configured or is placeholder. Discord bot worker standing by.");
            return;
        }

        try
        {
            _client = new DiscordSocketClient(new DiscordSocketConfig
            {
                GatewayIntents = GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
                AlwaysDownloadUsers = false,
                LogLevel = LogSeverity.Info,
            });

            _client.Log += LogAsync;
            _client.Ready += OnReadyAsync;
            _client.SlashCommandExecuted += HandleSlashCommandAsync;
            _client.ButtonExecuted += HandleButtonExecutedAsync;
            _client.ModalSubmitted += HandleModalSubmittedAsync;

            await _client.LoginAsync(TokenType.Bot, token);
            await _client.StartAsync();
            _logger.LogInformation("Discord Bot client connected and listening.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start Discord Bot client.");
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_client != null)
        {
            await _client.StopAsync();
            await _client.LogoutAsync();
            _client.Dispose();
        }
    }

    private Task LogAsync(LogMessage log)
    {
        _logger.LogInformation("[Discord.Net] {Source}: {Message}", log.Source, log.Message);
        return Task.CompletedTask;
    }

    private async Task OnReadyAsync()
    {
        _logger.LogInformation("Discord bot ready. Registering global slash commands...");
        if (_client == null) return;

        try
        {
            var orderCommand = new SlashCommandBuilder()
                .WithName("order")
                .WithDescription("Initiate or track an EA Sports FC boost order")
                .AddOption("reference", ApplicationCommandOptionType.String, "Your website order reference code (e.g. FC-ORD-12345)", isRequired: false);

            var statusCommand = new SlashCommandBuilder()
                .WithName("status")
                .WithDescription("Check real-time live status for your FC order")
                .AddOption("order_number", ApplicationCommandOptionType.String, "Order number (e.g. FC-ORD-94821)", isRequired: true);

            var panelCommand = new SlashCommandBuilder()
                .WithName("panel")
                .WithDescription("Post the interactive FC BOOST PRO Ticket Creation Panel in this channel")
                .WithDefaultMemberPermissions(GuildPermission.Administrator);

            await _client.CreateGlobalApplicationCommandAsync(orderCommand.Build());
            await _client.CreateGlobalApplicationCommandAsync(statusCommand.Build());
            await _client.CreateGlobalApplicationCommandAsync(panelCommand.Build());
            _logger.LogInformation("Global slash commands registered successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to register Discord slash commands.");
        }
    }

    private async Task HandleSlashCommandAsync(SocketSlashCommand command)
    {
        await command.DeferAsync(ephemeral: true);

        using var scope = _serviceProvider.CreateScope();
        var lifecycle = scope.ServiceProvider.GetRequiredService<IOrderLifecycleService>();

        if (command.Data.Name == "status")
        {
            var orderNum = command.Data.Options.FirstOrDefault(o => o.Name == "order_number")?.Value?.ToString() ?? "";
            var order = await lifecycle.GetOrderByNumberOrReferenceAsync(orderNum);

            if (order == null)
            {
                await command.FollowupAsync($"❌ No order found matching reference `{orderNum}`. Please verify your order code.", ephemeral: true);
                return;
            }

            var embed = new EmbedBuilder()
                .WithTitle($"Order Status: #{order.OrderNumber}")
                .WithColor(order.Status switch
                {
                    "Completed" => Color.Green,
                    "InProgress" => Color.Gold,
                    "UnderReview" => Color.Purple,
                    "AwaitingCustomer" => Color.Red,
                    _ => Color.Blue
                })
                .AddField("Service", order.ServiceName, inline: true)
                .AddField("Platform", order.Platform, inline: true)
                .AddField("Status", order.Status, inline: true)
                .AddField("Price", $"${order.PriceSnapshot:F2} USD", inline: true)
                .AddField("Created", order.CreatedAt.ToString("g"), inline: true)
                .AddField("Score", order.CurrentScore ?? "Awaiting Booster Assignment", inline: false)
                .WithFooter("FC BOOST PRO • 100% Ban-Free Residential VPN")
                .WithCurrentTimestamp()
                .Build();

            await command.FollowupAsync(embed: embed, ephemeral: true);
        }
        else if (command.Data.Name == "order")
        {
            var refCode = command.Data.Options.FirstOrDefault(o => o.Name == "reference")?.Value?.ToString();

            if (string.IsNullOrWhiteSpace(refCode))
            {
                var generalEmbed = new EmbedBuilder()
                    .WithTitle("🎮 Welcome to FC BOOST PRO Discord Ordering")
                    .WithDescription("To start a boost, configure your service on our website and click **Order Now (WhatsApp / Discord)** to receive a unique reference.")
                    .AddField("Official Website", "[Visit FC BOOST PRO Catalog](https://fc-25-boosting-services.vercel.app)", inline: false)
                    .WithColor(Color.Green)
                    .Build();

                var createBtn = new ComponentBuilder()
                    .WithButton("🎫 Open Boost Ticket", "open_boost_ticket", ButtonStyle.Success, new Emoji("🎮"));

                await command.FollowupAsync(embed: generalEmbed, components: createBtn.Build(), ephemeral: true);
                return;
            }

            var order = await lifecycle.GetOrderByNumberOrReferenceAsync(refCode);

            if (order != null)
            {
                var buttons = new ComponentBuilder()
                    .WithButton("Create Private Booster Ticket", $"confirm_order_{order.OrderNumber}", ButtonStyle.Success, new Emoji("🎫"))
                    .WithButton("Need Assistance", $"help_order_{order.OrderNumber}", ButtonStyle.Secondary);

                var embed = new EmbedBuilder()
                    .WithTitle($"Found Order #{order.OrderNumber}")
                    .WithColor(Color.Green)
                    .AddField("Service", order.ServiceName, inline: true)
                    .AddField("Price", $"${order.PriceSnapshot:F2} USD", inline: true)
                    .AddField("Current Status", order.Status, inline: true)
                    .WithDescription("Click below to create your private 1-on-1 confidential booster channel in this server.")
                    .Build();

                await command.FollowupAsync(embed: embed, components: buttons.Build(), ephemeral: true);
            }
            else
            {
                await command.FollowupAsync($"⚠️ Reference code `{refCode}` not found in active orders. You can create a new ticket below.", ephemeral: true);
            }
        }
        else if (command.Data.Name == "panel")
        {
            var panelEmbed = new EmbedBuilder()
                .WithTitle("🎮 FC BOOST PRO — OFFICIAL 1-ON-1 TICKETING SYSTEM")
                .WithDescription("Welcome to the **FC BOOST PRO** official community!\n\nNeed Rank 1 in Champions Finals, Elite Division in Rivals, or 1-on-1 Pro Coaching? Open a confidential support & fulfillment ticket below.")
                .AddField("⚡ Instant Pro Assignment", "A verified Top 200 Pro Booster will be assigned to your ticket within 5-10 minutes.", inline: false)
                .AddField("🛡️ 100% Ban-Free Residential VPN", "Boosters connect using dedicated residential VPN matching your exact regional location.", inline: false)
                .AddField("🔒 Zero Account Risk", "All communications are restricted to you, assigned pro, and staff only.", inline: false)
                .WithColor(Color.Green)
                .WithFooter("FC BOOST PRO Automated Ticketing System • Powered by SQL Server")
                .WithCurrentTimestamp()
                .Build();

            var panelButtons = new ComponentBuilder()
                .WithButton("🎫 Open Boost Ticket", "open_boost_ticket", ButtonStyle.Success, new Emoji("🎮"))
                .WithButton("🌐 Website Store", null, ButtonStyle.Link, url: "https://fc-25-boosting-services.vercel.app");

            if (command.Channel is SocketTextChannel textChannel)
            {
                await textChannel.SendMessageAsync(embed: panelEmbed, components: panelButtons.Build());
                await command.FollowupAsync("✅ Ticket creation panel deployed successfully in this channel!", ephemeral: true);
            }
            else
            {
                await command.FollowupAsync("Please run this command inside a text channel.", ephemeral: true);
            }
        }
    }

    private async Task HandleButtonExecutedAsync(SocketMessageComponent component)
    {
        var customId = component.Data.CustomId;

        if (customId.StartsWith("confirm_order_"))
        {
            var orderRef = customId.Replace("confirm_order_", "");

            var mb = new ModalBuilder()
                .WithTitle($"Confirm Ticket #{orderRef}")
                .WithCustomId($"modal_order_{orderRef}")
                .AddTextInput("GamerTag / PSN / Xbox ID", "gamertag", TextInputStyle.Short, "e.g. ProStriker_99", required: true)
                .AddTextInput("Preferred Platform", "platform", TextInputStyle.Short, "PS5 / Xbox / PC", required: true)
                .AddTextInput("Special Instructions / Tactics", "tactics", TextInputStyle.Paragraph, "e.g. 4-3-2-1 Direct Passing, do not open stored packs", required: false);

            await component.RespondWithModalAsync(mb.Build());
        }
        else if (customId == "open_boost_ticket")
        {
            var mb = new ModalBuilder()
                .WithTitle("Open FC 25 Boost Ticket")
                .WithCustomId("modal_create_new_ticket")
                .AddTextInput("Service Desired", "service", TextInputStyle.Short, "e.g. Champions Finals 15 Wins, Rivals 7 Wins", required: true)
                .AddTextInput("Platform", "platform", TextInputStyle.Short, "PS5 / Xbox / PC", required: true)
                .AddTextInput("GamerTag / PSN / EA ID", "gamertag", TextInputStyle.Short, "e.g. ProStriker_99", required: true)
                .AddTextInput("Website Order Code (Optional)", "order_ref", TextInputStyle.Short, "e.g. FC-ORD-12345 (if created on website)", required: false);

            await component.RespondWithModalAsync(mb.Build());
        }
        else if (customId.StartsWith("claim_ticket_"))
        {
            var orderRef = customId.Replace("claim_ticket_", "");
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();
            var order = await db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderRef);
            if (order != null && (order.Status == "Pending" || order.Status == "Open"))
            {
                order.Status = "InProgress";
                order.StartedAt = DateTime.UtcNow;
                order.CurrentScore = $"Booster @{component.User.Username} Assigned & Starting Matches";
                order.UpdatedAt = DateTime.UtcNow;

                db.OrderAuditLogs.Add(new OrderAuditLog
                {
                    OrderId = order.OrderId,
                    ActorUserId = component.User.Id.ToString(),
                    ActorRole = "Player",
                    ActionType = "ClaimedViaDiscord",
                    OldStatus = "Pending",
                    NewStatus = "InProgress",
                    Description = $"Order #{order.OrderNumber} claimed via Discord Ticket by @{component.User.Username}.",
                    Timestamp = DateTime.UtcNow
                });

                await db.SaveChangesAsync();

                await component.RespondAsync($"🎮 Pro Booster <@{component.User.Id}> has officially claimed Order `#{orderRef}`! Regional residential VPN initialized.", ephemeral: false);
            }
            else
            {
                await component.RespondAsync("⚠️ Order has already been claimed or is no longer pending.", ephemeral: true);
            }
        }
        else if (customId.StartsWith("close_ticket_"))
        {
            var orderRef = customId.Replace("close_ticket_", "");
            await component.RespondAsync($"🔒 Ticket for Order `#{orderRef}` is closing by request of <@{component.User.Id}>. Channel will be deleted in 5 seconds.", ephemeral: false);
            if (component.Channel is SocketTextChannel textChannel)
            {
                _ = Task.Run(async () =>
                {
                    await Task.Delay(5000);
                    await textChannel.DeleteAsync();
                });
            }
        }
        else if (customId.StartsWith("help_order_"))
        {
            await component.RespondAsync("A manager has been notified. You can also reach our 24/7 WhatsApp desk directly from the site.", ephemeral: true);
        }
    }

    private async Task HandleModalSubmittedAsync(SocketModal modal)
    {
        await modal.DeferAsync(ephemeral: true);

        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();

        string orderRef;
        Order? order = null;

        if (modal.Data.CustomId.StartsWith("modal_order_"))
        {
            orderRef = modal.Data.CustomId.Replace("modal_order_", "");
            var gamerTag = modal.Data.Components.FirstOrDefault(c => c.CustomId == "gamertag")?.Value ?? "Provided";
            var platform = modal.Data.Components.FirstOrDefault(c => c.CustomId == "platform")?.Value ?? "PS5";

            order = await db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderRef);
            if (order != null)
            {
                order.GamerTag = gamerTag;
                order.Platform = platform;
                order.DiscordUserId = modal.User.Id.ToString();
                order.UpdatedAt = DateTime.UtcNow;

                order.OrderDetails.Add(new OrderDetail
                {
                    OrderId = order.OrderId,
                    FieldName = "Discord Ticket Confirmation",
                    FieldValue = $"Confirmed by {modal.User.Username} (ID: {modal.User.Id})",
                });

                await db.SaveChangesAsync();
            }
        }
        else if (modal.Data.CustomId == "modal_create_new_ticket")
        {
            var customRef = modal.Data.Components.FirstOrDefault(c => c.CustomId == "order_ref")?.Value;
            orderRef = !string.IsNullOrWhiteSpace(customRef) ? customRef : $"FC-ORD-{Random.Shared.Next(10000, 99999)}";
            var service = modal.Data.Components.FirstOrDefault(c => c.CustomId == "service")?.Value ?? "Custom Boost";
            var platform = modal.Data.Components.FirstOrDefault(c => c.CustomId == "platform")?.Value ?? "PS5";
            var gamerTag = modal.Data.Components.FirstOrDefault(c => c.CustomId == "gamertag")?.Value ?? modal.User.Username;

            order = await db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderRef);
            if (order == null)
            {
                order = new Order
                {
                    OrderNumber = orderRef,
                    ServiceId = "discord-ticket",
                    ServiceName = service,
                    Platform = platform,
                    ContactMethod = "Discord",
                    PaymentMethod = "Discord Ticket / Crypto / Card",
                    CustomerName = modal.User.Username,
                    CustomerEmail = $"{modal.User.Username.ToLower()}@discord.customer.com",
                    GamerTag = gamerTag,
                    DiscordUserId = modal.User.Id.ToString(),
                    PriceSnapshot = 59.99m,
                    Status = "Pending",
                    CurrentScore = "Awaiting Booster Assignment",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                order.StatusHistory.Add(new OrderStatusHistory
                {
                    PreviousStatus = "None",
                    NewStatus = "Pending",
                    ChangedByUserId = modal.User.Id.ToString(),
                    ChangedAt = DateTime.UtcNow,
                    Notes = $"Ticket created directly from Discord Community by {modal.User.Username}."
                });

                order.AuditLogs.Add(new OrderAuditLog
                {
                    OrderId = order.OrderId,
                    ActorUserId = modal.User.Id.ToString(),
                    ActorRole = "Customer",
                    ActionType = "CreatedViaDiscord",
                    NewStatus = "Pending",
                    Description = $"Order #{order.OrderNumber} created via Discord Community ticket.",
                    Timestamp = DateTime.UtcNow
                });

                await db.Orders.AddAsync(order);
                await db.SaveChangesAsync();
            }
        }
        else
        {
            return;
        }

        // CREATE PRIVATE DISCORD CHANNEL FOR TICKET
        ITextChannel? ticketChannel = null;
        if (order != null && modal.GuildId.HasValue && _client != null)
        {
            var guild = _client.GetGuild(modal.GuildId.Value);
            if (guild != null)
            {
                try
                {
                    var category = guild.CategoryChannels.FirstOrDefault(c => c.Name.Contains("TICKETS", StringComparison.OrdinalIgnoreCase));
                    ulong? catId = category?.Id;
                    if (category == null)
                    {
                        var newCat = await guild.CreateCategoryChannelAsync("🎫 │ SUPPORT TICKETS");
                        catId = newCat.Id;
                    }

                    ticketChannel = await guild.CreateTextChannelAsync($"ticket-{order.OrderNumber.ToLower()}", prop =>
                    {
                        prop.CategoryId = catId;
                        prop.Topic = $"FC BOOST PRO Private Order Ticket #{order.OrderNumber} for @{modal.User.Username}";
                    });

                    // Set private channel permissions:
                    // 1. Everyone: Deny View
                    await ticketChannel.AddPermissionOverwriteAsync(guild.EveryoneRole, new OverwritePermissions(viewChannel: PermValue.Deny));

                    // 2. Customer: Allow View, Send, Attach files
                    await ticketChannel.AddPermissionOverwriteAsync(modal.User, new OverwritePermissions(
                        viewChannel: PermValue.Allow,
                        sendMessages: PermValue.Allow,
                        attachFiles: PermValue.Allow,
                        readMessageHistory: PermValue.Allow));

                    // Send initial embed inside private ticket channel
                    var ticketButtons = new ComponentBuilder()
                        .WithButton("Claim as Pro Booster", $"claim_ticket_{order.OrderNumber}", ButtonStyle.Success, new Emoji("🎮"))
                        .WithButton("Close Ticket", $"close_ticket_{order.OrderNumber}", ButtonStyle.Danger, new Emoji("🔒"));

                    var ticketEmbed = new EmbedBuilder()
                        .WithTitle($"🎮 Private Order Ticket: #{order.OrderNumber}")
                        .WithDescription($"Welcome <@{modal.User.Id}>! Your private boost channel is officially active.")
                        .AddField("Service", order.ServiceName, inline: true)
                        .AddField("Platform", order.Platform, inline: true)
                        .AddField("Price", $"${order.PriceSnapshot:F2} USD", inline: true)
                        .AddField("Client GamerTag", order.GamerTag, inline: true)
                        .AddField("Status", order.Status, inline: true)
                        .AddField("Security Protocol", "🛡️ All matches played on Residential VPN matching your regional subnet.", inline: false)
                        .WithColor(Color.Green)
                        .WithFooter("FC BOOST PRO Automated Ticketing System")
                        .WithCurrentTimestamp()
                        .Build();

                    await ticketChannel.SendMessageAsync($"<@{modal.User.Id}> Welcome! A pro booster and admin have been notified. Please communicate here regarding your order.", embed: ticketEmbed, components: ticketButtons.Build());
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Could not automatically create private text channel in guild.");
                }
            }
        }

        var channelMention = ticketChannel != null ? $" <#{ticketChannel.Id}>" : "";
        await modal.FollowupAsync($"✅ Order `#{orderRef}` successfully queued! Your private ticket channel is ready:{channelMention}. A pro booster is joining shortly.", ephemeral: true);
    }

    public async Task<bool> SendOrderStatusUpdateNotificationAsync(string orderNumber, string newStatus, string? note)
    {
        if (_client == null || _client.ConnectionState != ConnectionState.Connected)
        {
            _logger.LogWarning("Discord client not connected. Notification for order {OrderNumber} bypassed.", orderNumber);
            return false;
        }

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();

            var order = await db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
            if (order?.DiscordUserId != null && ulong.TryParse(order.DiscordUserId, out var discordUserId))
            {
                var user = await _client.GetUserAsync(discordUserId);
                if (user != null)
                {
                    var embed = new EmbedBuilder()
                        .WithTitle($"Order Update: #{order.OrderNumber}")
                        .WithDescription($"Your order status has changed to **{newStatus}**.")
                        .AddField("Note", note ?? "Status updated by admin/booster desk.", inline: false)
                        .WithColor(newStatus == "Completed" ? Color.Green : Color.Blue)
                        .WithCurrentTimestamp()
                        .Build();

                    await user.SendMessageAsync(embed: embed);
                    return true;
                }
            }
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send Discord direct message notification for order #{OrderNumber}.", orderNumber);
            return false;
        }
    }
}
