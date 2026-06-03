class VotingEngine {
  compileVotes(votes) {
    const rejections = votes.filter(v => v.action === 'REJECT');
    return rejections.length === 0;
  }
}

module.exports = { VotingEngine };
