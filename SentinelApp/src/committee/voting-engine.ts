import { AgentVote } from './types';

export class VotingEngine {
  public compileVotes(votes: AgentVote[]): boolean {
    const rejections = votes.filter(v => v.action === 'REJECT');
    return rejections.length === 0; // Requires unanimous approval for this basic implementation
  }
}
