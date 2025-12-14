import React from 'react';
import { Sparkles, HelpCircle, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Header({ onReset }) {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="size-5 text-primary" />
                </div>
                <h1 className="font-bold text-lg tracking-tight">Screenshot<span className="text-primary">2</span>Code</h1>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={onReset} className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary rounded-md" aria-label="Reset">
                    <RotateCcw className="size-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary rounded-md" aria-label="Help">
                    <HelpCircle className="size-4" />
                </button>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-4 py-2 bg-foreground text-background font-medium text-sm rounded-lg hover:bg-foreground/90 transition-colors"
                >
                    Pro Mode
                </a>
            </div>
        </header>
    );
}
