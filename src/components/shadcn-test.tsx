"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertCircle, CheckCircle2, Upload, Settings, User, LogOut } from "lucide-react"

export function ShadcnTest() {
    const [progress, setProgress] = useState(65)
    const [selectedSubject, setSelectedSubject] = useState("")

    return (
        <div className="space-y-8 p-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    🎨 Shadcn/UI Components Test
                </h1>
                <p className="text-muted-foreground">
                    Testing all integrated Shadcn/UI components with Qimma theming
                </p>
            </div>

            {/* Buttons Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>Different button variants and states</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button>Default</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button size="sm">Small</Button>
                        <Button size="lg">Large</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Form Components */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Components</CardTitle>
                    <CardDescription>Input fields, selects, and form elements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mathematics">Mathematics</SelectItem>
                                    <SelectItem value="physics">Physics</SelectItem>
                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                    <SelectItem value="biology">Biology</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter exam description..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Alerts and Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts</CardTitle>
                        <CardDescription>Different alert types</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your exam has been processed successfully.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Failed to process the exam. Please try again.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Badges & Progress</CardTitle>
                        <CardDescription>Status indicators and progress bars</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Error</Badge>
                            <Badge variant="outline">Outline</Badge>
                        </div>
                        <div className="space-y-2">
                            <Label>Processing Progress</Label>
                            <Progress value={progress} className="w-full" />
                            <p className="text-sm text-muted-foreground">{progress}% complete</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Components */}
            <Card>
                <CardHeader>
                    <CardTitle>Interactive Components</CardTitle>
                    <CardDescription>Dialogs, dropdowns, and other interactive elements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {/* Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Files
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Exam Files</DialogTitle>
                                    <DialogDescription>
                                        Select the exam files you want to upload for processing.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="file">Select Files</Label>
                                        <Input id="file" type="file" multiple />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Upload</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Dropdown Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="h-4 w-4 mr-2" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            {/* Separator */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Separator Example</h3>
                <div className="space-y-2">
                    <p className="text-sm">Section 1</p>
                    <Separator />
                    <p className="text-sm">Section 2</p>
                </div>
            </div>

            {/* Action Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Ready to Build Qimma!</CardTitle>
                    <CardDescription>
                        All Shadcn/UI components are working perfectly with your Tailwind configuration.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Continue to Next Task
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
} 