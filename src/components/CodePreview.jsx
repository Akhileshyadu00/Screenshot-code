import React, { useState, useEffect } from 'react';
import { Eye, Code, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../lib/utils';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert Frontend Developer. 
Your task is to generate HTML code using Tailwind CSS that exactly matches the provided screenshot.
- Output ONLY the full HTML code. Do not include markdown backticks or explanations.
- Use a single HTML file with Tailwind CDN for simplicity in preview.
- Use widely available fonts and placeholder images (via unsplash) if text/images are unreadable.
- The code should be fully responsive and accessible.
- If the image contains a specific component, generate just that component wrapped in a container.
- Ensure the background color matches the screenshot.`;

export default function CodePreview({ image, apiKey }) {
    const [activeTab, setActiveTab] = useState('preview');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function generateCode() {
            if (!apiKey) {
                setError("Missing OpenAI API Key. Please add it in the settings.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const resizeImage = (file) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                            const img = new Image();
                            img.src = e.target.result;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 1024; // Good balance for speed/quality
                                let width = img.width;
                                let height = img.height;

                                if (width > MAX_WIDTH) {
                                    height = height * (MAX_WIDTH / width);
                                    width = MAX_WIDTH;
                                }

                                canvas.width = width;
                                canvas.height = height;

                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, width, height);
                                resolve(canvas.toDataURL('image/jpeg', 0.7));
                            };
                        };
                    });
                };

                const base64Image = await resizeImage(image);

                const openai = new OpenAI({
                    apiKey: apiKey,
                    dangerouslyAllowBrowser: true
                });

                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: SYSTEM_PROMPT
                        },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "Generate code for this screenshot." },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: base64Image,
                                    },
                                },
                            ],
                        },
                    ],
                    max_tokens: 4096,
                });

                let code = response.choices[0].message.content;
                if (code.startsWith('```html')) code = code.replace(/^```html\n/, '').replace(/```$/, '');
                else if (code.startsWith('```')) code = code.replace(/^```\n/, '').replace(/```$/, '');

                setGeneratedCode(code);
            } catch (err) {
                console.error("Generation error:", err);
                const errorMessage = err?.error?.message || err.message || "Failed to generate code. Please check your API key.";
                setError(errorMessage);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }

        if (image) {
            generateCode();
        }
    }, [image, apiKey]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-card rounded-xl border border-border shadow-sm animate-in fade-in zoom-in-95 duration-300 p-6 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-background p-4 rounded-full border border-border">
                        <Loader2 className="size-8 text-primary animate-spin" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold animate-pulse mb-2">Analyzing Screenshot...</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    Sending to GPT-4o for pixel-perfect conversion. This may take a few seconds.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-card rounded-xl border border-destructive/50 shadow-sm p-6 text-center">
                <AlertCircle className="size-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold text-destructive mb-2">Generation Failed</h3>
                <p className="text-muted-foreground text-sm max-w-md mb-6">{error}</p>
                {!apiKey && (
                    <div className="p-3 bg-secondary/50 rounded-lg text-xs text-left w-full max-w-sm">
                        <p className="font-semibold mb-1">How to fix:</p>
                        1. Get your API Key from <a href="https://platform.openai.com" target="_blank" className="text-primary hover:underline">OpenAI Dashboard</a>.<br />
                        2. Paste it in the Sidebar settings on the left.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="h-12 border-b border-border bg-secondary/30 flex items-center justify-between px-4">
                <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === 'preview' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Eye className="size-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === 'code' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Code className="size-4" />
                        Code
                    </button>
                </div>

                {activeTab === 'code' && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                )}
            </div>

            <div className="flex-1 relative overflow-hidden bg-background/50">
                {activeTab === 'preview' ? (
                    <iframe
                        srcDoc={generatedCode}
                        title="Preview"
                        className="w-full h-full border-none bg-white"
                        sandbox="allow-scripts"
                    />
                ) : (
                    <div className="w-full h-full overflow-auto text-sm">
                        <SyntaxHighlighter
                            language="html"
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: '1.5rem', height: '100%', background: 'transparent' }}
                            showLineNumbers={true}
                            wrapLines={true}
                        >
                            {generatedCode}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </div>
    );
}
