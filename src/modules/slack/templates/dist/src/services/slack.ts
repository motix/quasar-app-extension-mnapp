import { uniq } from 'lodash';
import slack from 'slack';

import { SlackMessage } from 'models/slack';

export async function loadPrivateChannelMessages(channelName: string) {
  const conversationsResult = await slack.users.conversations({
    token: process.env.SLACK_ACCESS_TOKEN,
    types: 'private_channel',
  });

  const channel = conversationsResult.channels.find(
    (value) => value.name === channelName
  );

  if (!channel) {
    return {
      channelId: null,
      messages: null,
    };
  }

  const historyResult = await slack.conversations.history({
    token: process.env.SLACK_ACCESS_TOKEN,
    channel: channel.id,
  });

  const userIds = uniq(historyResult.messages.map((value) => value.user));

  const infoResults = await Promise.all(
    userIds.map((value) =>
      slack.users.info({
        token: process.env.SLACK_ACCESS_TOKEN,
        user: value,
      })
    )
  );

  const users = Object.fromEntries(
    infoResults.map((value) => [
      value.user.id,
      {
        id: value.user.id,
        email: value.user.profile.email,
        fullName: value.user.real_name,
        photoUrl: value.user.profile.image_192,
      },
    ])
  );

  const messages: SlackMessage[] = historyResult.messages
    .filter(
      (value) =>
        !value.text.endsWith('has joined the channel') &&
        !value.text.startsWith('set the channel description') &&
        !value.text.startsWith('has renamed the channel from')
    )
    .map((value) => ({
      timestamp: new Date(Number(value.ts) * 1000),
      user: users[value.user],
      text: value.text,
    }))
    .reverse();

  return {
    channelId: channel.id,
    messages,
  };
}
