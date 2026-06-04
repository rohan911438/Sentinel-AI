import { NextRequest, NextResponse } from 'next/server';
import { CommitteeOrchestrator } from '@/committee/committee-orchestrator';
import { StrategyInputs } from '@/committee/types';

export async function POST(req: NextRequest) {
  try {
    const inputs: StrategyInputs = await req.json();
    
    // Instantiate orchestrator
    const orchestrator = new CommitteeOrchestrator();
    
    // Run committee and get timeline + final decision
    const { decision, timeline } = await orchestrator.runCommittee(inputs);
    
    return NextResponse.json({ decision, timeline }, { status: 200 });
  } catch (error) {
    console.error('Error in debate API:', error);
    return NextResponse.json({ error: 'Failed to process committee debate' }, { status: 500 });
  }
}
