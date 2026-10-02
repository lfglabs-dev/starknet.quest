import { useState } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { QUEST_ABI } from '@/constants/quest';
import { Quest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Coins, Copy, ExternalLink, Gift, Lock, Ticket, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useRewards } from '@/hooks/useRewards';
import { formatRewardAmount, getRewardTokenSymbol, getRewardTokenDecimals } from '@/utils/rewards';
import Image from 'next/image';
import Link from 'next/link';
import { ClaimModal } from './ClaimModal';
import { Progress } from '@/components/ui/progress';

interface RewardSectionProps {
  quest: Quest;
}

export function RewardSection({ quest }: RewardSectionProps) {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const { rewards, isLoading, claimRewards } = useRewards(quest);
  const [claiming, setClaiming] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [showProofInput, setShowProofInput] = useState(false);
  const [proofLink, setProofLink] = useState('');
  const [verifying, setVerifying] = useState(false);

  const { data: nativeBalance } = useBalance({
    address,
  });

  const handleCopyWallet = async () => {
    if (!quest.walletAddress) return;
    await navigator.clipboard.writeText(quest.walletAddress);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimClick = () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (rewards.length === 0) {
      toast.info('No rewards to claim');
      return;
    }
    setShowClaimModal(true);
  };

  const handleClaimConfirm = async () => {
    if (!address) return;
    setClaiming(true);
    try {
      const result = await claimRewards(address);
      if (result.success) {
        setClaimSuccess(true);
        toast.success(`Successfully claimed ${result.claimedRewards.length} rewards!`);
        setTimeout(() => {
          setShowClaimModal(false);
          setClaimSuccess(false);
        }, 3000);
      } else {
        toast.error(result.error || 'Failed to claim rewards');
      }
    } catch (error) {
      toast.error('Failed to claim rewards');
    } finally {
      setClaiming(false);
    }
  };

  const totalRewardValue = rewards.reduce((sum, r) => sum + (r.amount || 0), 0);

  const rewardTokenSymbol = rewards.length > 0 ? getRewardTokenSymbol(rewards[0].tokenAddress) : 'TOKEN';

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Reward</h2>
        {quest.requireVerification && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Requires verification</span>
          </div>
        )}
      </div>

      {/* New Redesigned Data Card */}
      <div className="relative bg-card border border-border rounded-xl p-6 overflow-hidden">
        {/* Decorative gradient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Token Icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            {rewards.length > 0 && rewards[0].tokenImage ? (
              <Image
                src={rewards[0].tokenImage}
                alt={getRewardTokenSymbol(rewards[0].tokenAddress)}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <Coins className="w-8 h-8 text-primary" />
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-foreground">
                {formatRewardAmount(totalRewardValue, rewards[0]?.tokenAddress)}
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0 font-medium">
                {rewardTokenSymbol}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              Total reward amount
            </p>
          </div>

          {/* Status + Action */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Checking rewards...
              </div>
            ) : rewards.length > 0 ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-medium">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Eligible
                </Badge>
                <Button
                  onClick={handleClaimClick}
                  disabled={claiming}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {claiming ? 'Claiming...' : 'Claim'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-3 h-3" />
                No rewards yet
              </div>
            )}
            {quest.walletAddress && (
              <button
                onClick={handleCopyWallet}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      {quest.requireVerification && !showProofInput && (
        <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <Ticket className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Verification Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                You need to verify your proof before claiming the reward.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowProofInput(true)}
              >
                Submit Proof
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Input */}
      {showProofInput && (
        <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <Ticket className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-3">
                Submit your proof to verify eligibility
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="proof-link" className="text-sm text-muted-foreground">
                    Proof Link
                  </Label>
                  <Input
                    id="proof-link"
                    placeholder="https://..."
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!proofLink.trim()) {
                        toast.error('Please enter a proof link');
                        return;
                      }
                      setVerifying(true);
                      // TODO: Implement verification logic
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      setVerifying(false);
                      setShowProofInput(false);
                      toast.success('Proof submitted! Your eligibility will be verified.');
                    }}
                    disabled={verifying}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {verifying ? 'Verifying...' : 'Submit Proof'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProofInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        open={showClaimModal}
        onOpenChange={setShowClaimModal}
        onSuccess={() => setClaimSuccess(true)}
        quest={quest}
        rewards={rewards}
        onClaim={handleClaimConfirm}
        isClaiming={claiming}
      />

      {/* Success State */}
      {claimSuccess && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-500">Rewards Claimed Successfully!</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your rewards have been sent to your wallet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Rewards are distributed automatically after quest completion. 
          Make sure your wallet is connected and you meet all requirements.
        </p>
      </div>
    </div>
  );
}
