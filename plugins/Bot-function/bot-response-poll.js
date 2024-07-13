const {
  getAggregateVotesInPollMessage,
  normalizeMessageContent,
  jidNormalizedUser,
  getKeyAuthor,
  decryptPollVote
} = await (await import("@whiskeysockets/baileys")).default;
import _ from "lodash";
export async function all(m, chatUpdate) {
  try {
    if (m.isBaileys || !m.message?.pollUpdateMessage) return;
    const content = normalizeMessageContent(m.message);
    if (!content) return;
    const creationMsgKey = content.pollUpdateMessage.pollCreationMessageKey;
    const contents_of_poll = _.find(store.messages[m.chat]?.array, item => creationMsgKey.id === item.key.id);
    if (!contents_of_poll) return;
    const pollCreation = contents_of_poll.message;
    const meIdNormalised = jidNormalizedUser(this.authState.creds.me.id);
    const voterJid = getKeyAuthor(m.key, meIdNormalised);
    const pollCreatorJid = getKeyAuthor(creationMsgKey, meIdNormalised);
    const pollEncKey = pollCreation.messageContextInfo?.messageSecret;
    const voteMsg = decryptPollVote(content.pollUpdateMessage.vote, {
      pollEncKey: pollEncKey,
      pollCreatorJid: pollCreatorJid,
      pollMsgId: creationMsgKey.id,
      voterJid: voterJid
    });
    if (!voteMsg) return;
    const poll_output = [{
      key: creationMsgKey,
      update: {
        pollUpdates: [{
          pollUpdateMessageKey: m.key,
          vote: voteMsg,
          senderTimestampMs: m.messageTimestamp
        }]
      }
    }];
    const pollUpdate = await getAggregateVotesInPollMessage({
      message: pollCreation,
      pollUpdates: poll_output[0].update.pollUpdates
    });
    if (!pollUpdate) return;
    const toCmd = _.find(pollUpdate, v => v.voters.length !== 0)?.name;
    if (!toCmd) return;
    await this.appenTextMessage(m, toCmd, chatUpdate);
  } catch (error) {}
}
