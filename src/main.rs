use dotenv::dotenv;
use rand::rngs::OsRng;
use rand::Rng;
use std::env;

use serenity::async_trait;
use serenity::framework::standard::macros::{command, group};
use serenity::framework::standard::{CommandResult, StandardFramework};
use serenity::model::channel::Message;
use serenity::prelude::*;

#[group]
#[commands(gazou)]
struct General;

struct Handler;

#[async_trait]
impl EventHandler for Handler {}

#[tokio::main]
async fn main() {
    dotenv().ok();

    // プレフィクスの設定(/)
    let framework = StandardFramework::new()
        .configure(|c| c.prefix("/"))
        .group(&GENERAL_GROUP);

    // Login with a bot token from the environment
    let token = env::var("DISCORD_TOKEN").expect("token");
    let intents = GatewayIntents::non_privileged() | GatewayIntents::MESSAGE_CONTENT;
    let mut client = Client::builder(token, intents)
        .event_handler(Handler)
        .framework(framework)
        .await
        .expect("Error creating client");

    // start listening for events by starting a single shard
    if let Err(why) = client.start().await {
        println!("An error occurred while running the client: {:?}", why);
    }
}

#[command]
async fn gazou(ctx: &Context, msg: &Message) -> CommandResult {
    let channel_id = env::var("OMORO_ARCHIVES_CHANNEL_ID")
        .unwrap()
        .parse()
        .expect("Failed to parse GAZOU_CHANNEL_ID");

    let query = "?limit=100";
    let messages = ctx
        .http
        .get_messages(channel_id, query)
        .await
        .expect("get messages failed");

    let mut images = Vec::new();
    for message in messages {
        if message.author.bot {
            continue;
        }

        for attachment in message.attachments {
            let content_type = attachment.content_type.unwrap();
            if content_type.starts_with("image") {
                images.push(attachment.url)
            }
        }
    }

    let mut rng = OsRng::default();
    let index = rng.gen_range(0..images.len());
    let picked = images[index].clone();

    msg.reply(ctx, picked).await?;

    Ok(())
}
