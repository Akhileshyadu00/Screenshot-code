import React, { useState } from 'react';
import { Settings, Code2, Monitor, Layers, Zap } from 'lucide-react';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Switch } from './ui/Switch';

export default function Sidebar({ settings, updateSetting }) {
    return (
        <aside className="w-80 border-r border-border bg-card/30 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <div className="p-6 space-y-8">
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Settings className="size-4" />
                        Configuration
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Output Type</Label>
                            <Select
                                value={settings.outputType}
                                onChange={(e) => updateSetting('outputType', e.target.value)}
                            >
                                <option value="html">HTML + Tailwind</option>
                                <option value="react">React + Tailwind</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Styling Framework</Label>
                            <Select disabled value="tailwind" className="bg-secondary/50 opacity-70">
                                <option value="tailwind">Tailwind CSS</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Responsiveness</Label>
                            <Select
                                value={settings.responsiveness}
                                onChange={(e) => updateSetting('responsiveness', e.target.value)}
                            >
                                <option value="mobile">Mobile First</option>
                                <option value="desktop">Desktop First</option>
                            </Select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Code2 className="size-4" />
                        Code Options
                    </h2>
                    <div className="space-y-6">
                        {settings.outputType === 'react' && (
                            <div className="space-y-2">
                                <Label>Framework</Label>
                                <Select
                                    value={settings.framework}
                                    onChange={(e) => updateSetting('framework', e.target.value)}
                                >
                                    <option value="plain">Plain React</option>
                                    <option value="next">Next.js</option>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Structure</Label>
                            <Select
                                value={settings.components}
                                onChange={(e) => updateSetting('components', e.target.value)}
                            >
                                <option value="single">Single File</option>
                                <option value="multiple">Split Components</option>
                            </Select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Layers className="size-4" />
                        Advanced
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>OpenAI API Key</Label>
                            <input
                                type="password"
                                value={settings.apiKey || ''}
                                onChange={(e) => updateSetting('apiKey', e.target.value)}
                                placeholder="sk-..."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Key is stored locally. <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get Key &rarr;</a>
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="cursor-pointer" onClick={() => updateSetting('darkMode', !settings.darkMode)}>Dark Mode Support</Label>
                            <Switch checked={settings.darkMode} onCheckedChange={(val) => updateSetting('darkMode', val)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-border">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <Zap className="size-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Free Plan</p>
                        <p className="text-xs text-muted-foreground">3 gens remaining</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
