"use client";

import { useState, useRef, useEffect } from "react";
import { suggestPeople } from "@/utils/actions/suggestPeople";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Send,
  ChevronRight,
  Code,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { motion } from "framer-motion";
import Image from "next/image";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  prismaQuery?: string;
  explanation?: string;
  results?: any[];
}

function AIInput({
  onSearch,
  isLoading,
}: {
  onSearch: (query: string) => void;
  isLoading: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 40,
    maxHeight: 150,
  });

  const handleSubmit = () => {
    if (inputValue.trim() && !submitted && !isLoading) {
      onSearch(inputValue);
      setSubmitted(true);
      setInputValue("");

      // Reset submitted state after a delay
      setTimeout(() => {
        setSubmitted(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      <div className="relative max-w-xl w-full mx-auto">
        <Textarea
          id="ai-input"
          placeholder={
            isLoading
              ? "Waiting for response..."
              : "Type a role, skill, or experience.."
          }
          className={cn(
            "max-w-xl bg-background w-full rounded-2xl pl-4 pr-12 py-3 placeholder:text-muted-foreground/70 border-muted/30 focus-visible:ring-primary/20 text-foreground resize-none text-wrap leading-[1.2] transition-all duration-200",
            "min-h-[40px]",
            (submitted || isLoading) && "opacity-80"
          )}
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={submitted || isLoading}
        />
        <Button
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-1 h-8 w-8 transition-all duration-200",
            submitted || isLoading
              ? "bg-primary/10"
              : "bg-primary hover:bg-primary/90"
          )}
          type="button"
          onClick={handleSubmit}
          disabled={submitted || isLoading}
          size="icon"
        >
          {submitted || isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Send
              className={cn(
                "w-4 h-4 transition-opacity",
                inputValue ? "opacity-100" : "opacity-70"
              )}
            />
          )}
        </Button>
      </div>
      {isLoading && (
        <p className="text-xs text-center mt-2 text-muted-foreground animate-pulse">
          Searching for talent...
        </p>
      )}
    </div>
  );
}

// Infinite scrolling component using Framer Motion
function InfiniteScrollRow({
  queries,
  handleSearch,
  direction = "left",
  speed = 25,
}: {
  queries: string[];
  handleSearch: (query: string) => void;
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate the array to create a seamless loop effect
  const duplicatedQueries = [...queries, ...queries, ...queries];

  // Calculate total width based on an average width per item
  // This is an estimation and might need adjustment
  const avgItemWidth = 180; // pixels
  const totalWidth = queries.length * avgItemWidth;

  return (
    <div className="overflow-hidden relative w-full">
      <motion.div
        className="flex whitespace-nowrap py-1"
        animate={{
          x: direction === "left" ? -totalWidth : totalWidth,
        }}
        initial={{
          x: direction === "left" ? 0 : -totalWidth,
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: totalWidth / speed, // Speed factor
          repeatType: "loop",
        }}
      >
        {duplicatedQueries.map((query, index) => (
          <button
            key={`scroll-${direction}-${index}`}
            className="inline-flex mx-1 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm whitespace-nowrap transition-colors"
            onClick={() => handleSearch(query)}
          >
            {query}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

export default function StudentSearch() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await suggestPeople(query);

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "ai",
        content: response.explanation,
        prismaQuery: response.prismaQuery,
        results: response.results,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSelectedMessage(aiMessage.id);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "ai",
        content: `Error: ${err.message || "Failed to process your query"}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Find selected message details
  const selectedMessageData = messages.find((m) => m.id === selectedMessage);
  const hasResults =
    selectedMessageData?.results && selectedMessageData.results.length > 0;

  // Example queries for the infinite scroll
  const exampleQueries = [
    "Find computer science students",
    "Show me PhD students",
    "Students with React skills",
    "Find mobile developers",
    "Machine learning experts",
    "Students from Stanford",
    "Web developers with experience",
    "Students who know Python",
    "Find UX/UI designers",
    "Students with GitHub profiles",
    "Find students with internships",
    "Show me students interested in AI",
  ];

  return (
    <div className="flex h-screen">
      {/* Left panel - Results display */}
      <div className="flex-1 p-6 overflow-hidden border-r border-muted/30">
        {selectedMessage && selectedMessageData?.results ? (
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                {hasResults ? (
                  <>
                    <span>Students</span>
                    <Badge variant="outline" className="rounded-full">
                      {selectedMessageData.results.length}
                    </Badge>
                  </>
                ) : (
                  "No Results"
                )}
              </h2>
              <p className="text-muted-foreground mt-1">
                {selectedMessageData.explanation}
              </p>
            </div>

            {hasResults ? (
              <ScrollArea className="flex-1 pb-4 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-1">
                  {selectedMessageData.results.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8 rounded-lg border border-muted/40 bg-muted/10 max-w-md">
                  <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or ask a different
                    question.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md p-8 rounded-lg">
              <div className=" rounded-full flex items-center justify-center mx-auto mb-4">
                {" "}
                <Image width={200} height={100} src="/logo.svg" alt="logo" />
              </div>

              {/* <h2 className="text-xl font-bold mb-3">Find Talent</h2> */}
              <p className="text-muted-foreground">
                Ship faster. Build smarter. Find better people{" "}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right panel - Chat interface */}
      <div className="w-96 flex border-l flex-col bg-background h-full relative">
        <div className="flex-1 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {/* Purple circle logo */}

              <div className=" h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-8 bg-primary/10">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>

              {/* Main text */}
              <h2 className="text-lg font-semibold text-center mb-2">
                Who are you looking for today?
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {/* Reduced this margin from mb-10 to mb-6 */}
                Just type a role or skill — we’ll handle the rest.
              </p>

              {/* Infinite scroll containers with reduced gap */}
              <div className="space-y-1">
                {" "}
                {/* Reduced gap between rows */}
                <InfiniteScrollRow
                  queries={exampleQueries}
                  handleSearch={handleSearch}
                  direction="left"
                  speed={25}
                />
                <InfiniteScrollRow
                  queries={exampleQueries.slice().reverse()}
                  handleSearch={handleSearch}
                  direction="right"
                  speed={20}
                />
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 min-h-full pb-20">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-3 duration-300`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={
                      message.type === "ai" && message.results
                        ? () => setSelectedMessage(message.id)
                        : undefined
                    }
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-3 rounded-lg",
                        message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : selectedMessage === message.id
                            ? "bg-muted/70 cursor-pointer rounded-tl-none border border-muted/50"
                            : "bg-card border border-muted/30 cursor-pointer rounded-tl-none hover:border-muted/50 transition-colors"
                      )}
                    >
                      <div className="text-sm">{message.content}</div>

                      {message.type === "ai" && message.prismaQuery && (
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value="query" className="border-none">
                            <AccordionTrigger className="py-1 text-xs flex items-center text-muted-foreground">
                              <Code className="h-3 w-3 mr-1.5" />
                              Generated Query
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="text-xs font-mono p-2 rounded bg-muted/70 overflow-x-auto text-foreground">
                                {message.prismaQuery}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {message.type === "ai" && message.results && (
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <div className="flex-1">
                            {message.results.length > 0
                              ? `Found ${message.results.length} students`
                              : "No matching students"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-3">
                    <div className="max-w-[85%] p-3 rounded-lg bg-card border border-muted/30 rounded-tl-none">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Searching for students...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Fixed chat input at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-muted/30 bg-background">
          <AIInput onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: any }) {
  const fullName =
    `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
  const pd = student.personalDetails || {};
  const tp = student.technicalProfile || {};

  return (
    <Card className="overflow-hidden w-full border-muted/40 transition-all duration-200 hover:shadow-md hover:border-muted/60 group">
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3 bg-gradient-to-r from-muted/30 to-background">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-background">
          {student.image ? (
            <img
              src={student.image || "/placeholder.svg"}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-primary">
              {fullName.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-base line-clamp-1 group-hover:text-primary transition-colors">
            {fullName}
          </h3>
          <p className="text-xs text-muted-foreground">
            {student.username || student.email}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 space-y-3 text-sm">
        {pd.university && (
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{pd.university}</div>
              <div className="text-xs text-muted-foreground">
                {pd.department} · {pd.degreeLevel}
              </div>
            </div>
          </div>
        )}

        {tp.experienceLevel && (
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1 text-sm">{tp.experienceLevel} Developer</div>
          </div>
        )}

        {tp.primarySkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tp.primarySkills.slice(0, 5).map((skill: string) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {skill}
              </Badge>
            ))}
            {tp.primarySkills.length > 5 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{tp.primarySkills.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {(tp.githubUrl || tp.linkedinUrl) && (
          <div className="flex gap-2 pt-2 border-t border-muted/30 mt-2">
            {tp.githubUrl && (
              <a
                href={tp.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            )}

            {tp.linkedinUrl && (
              <a
                href={tp.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
