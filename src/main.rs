use chrono::{DateTime, Duration, Local, NaiveDate, NaiveDateTime, NaiveTime, TimeZone};
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
#[commands(gazou, aho)]
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

async fn get_all_messages(ctx: &Context) -> Vec<Message> {
    // let mut messages = Vec::new();
    let channel_id = env::var("CHANNEL_ID")
        .unwrap()
        .parse()
        .expect("Failed to parse CHANNEL_ID");

    // 一番最初に画像投稿された2020年8月を固定値として設定
    let native_datetime = NaiveDateTime::new(
        NaiveDate::from_ymd_opt(2020, 12, 1).unwrap(),
        NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
    );

    let mut after: DateTime<Local> = Local
        .from_local_datetime(&native_datetime)
        .earliest()
        .unwrap();
    let mut before = after + Duration::days(180);

    let now: DateTime<Local> = Local::now();
    let generate_query = |after: DateTime<Local>, before: DateTime<Local>| {
        format!(
            "?after={}&before={}&limit=100",
            after.format("%Y%m%d"),
            before.format("%Y%m%d")
        )
    };

    let mut messages: Vec<Message> = Vec::new();

    while before < now {
        let query = generate_query(after, before);
        println!("{}", query);

        let mut period_messages = ctx
            .http
            .get_messages(channel_id, query.as_str())
            .await
            .expect("get messages failed");

        messages.append(&mut period_messages);

        after = before;
        before = after + Duration::days(180);
    }

    // 最後に現在の日付まで読み込む
    let mut period_messages = ctx
        .http
        .get_messages(channel_id, generate_query(after, now).as_str())
        .await
        .expect("get messages failed");

    messages.append(&mut period_messages);

    messages
}

#[command]
async fn gazou(ctx: &Context, msg: &Message) -> CommandResult {
    let messages = get_all_messages(ctx).await;

    let mut images = Vec::new();
    for message in messages {
        if message.author.bot {
            continue;
        }

        for attachment in message.attachments {
            match attachment.content_type {
                Some(content_type) => {
                    if content_type.starts_with("image") {
                        images.push(attachment.url)
                    }
                }
                None => (),
            }
        }
    }

    println!("{}", images.len());

    let mut rng = OsRng::default();
    let index = rng.gen_range(0..images.len());
    let picked = images[index].clone();

    msg.reply(ctx, picked).await?;

    Ok(())
}

#[command]
async fn aho(ctx: &Context, msg: &Message) -> CommandResult {
    msg.reply(ctx, "まぬけがよ").await?;

    Ok(())
}

// AC6の封鎖機構の連絡コードを列挙したい
//#[command]
// async fn code(ctx: &Context, msg: &Message) -> CommandResult {
//     let code_index = &msg.content[5..];
//     match code_index {}
//     Ok(())
// }
