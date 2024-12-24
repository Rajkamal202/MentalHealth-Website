import React from 'react';
import { Button } from './ui/button';
import { Twitter, Linkedin } from 'lucide-react';

export default function ShareBadge({ badge, onShare }) {
  const shareOnTwitter = () => {
    const text = `I just earned the "${badge.name}" badge on Mindful! ${badge.description} #MentalHealthMatters`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onShare('twitter');
  };

  const shareOnLinkedIn = () => {
    const text = `I just earned the "${badge.name}" badge on Mindful!\n\n${badge.description}\n\n#MentalHealthMatters`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onShare('linkedin');
  };

  return (
    <div className="flex justify-center space-x-4">
      <Button
        onClick={shareOnTwitter}
        disabled={badge.shared.twitter}
        className="flex items-center"
      >
        <Twitter className="w-4 h-4 mr-2" />
        {badge.shared.twitter ? 'Shared' : 'Share on Twitter'}
      </Button>
      <Button
        onClick={shareOnLinkedIn}
        disabled={badge.shared.linkedin}
        className="flex items-center"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        {badge.shared.linkedin ? 'Shared' : 'Share on LinkedIn'}
      </Button>
    </div>
  );
}

