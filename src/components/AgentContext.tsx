"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Agent {
  id: string;
  name: string;
  theme: "blue" | "purple" | "emerald";
}

interface AgentContextType {
  agents: Agent[];
  activeAgent: Agent;
  setActiveAgent: (agent: Agent) => void;
  addAgent: (agent: Agent) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const DEFAULT_AGENTS: Agent[] = [
  { id: "default", name: "Customer Support Bot", theme: "blue" },
  { id: "sales", name: "Sales Assistant", theme: "purple" },
];

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [activeAgent, setActiveAgent] = useState<Agent>(DEFAULT_AGENTS[0]);

  const addAgent = (agent: Agent) => {
    setAgents((prev) => [...prev, agent]);
    setActiveAgent(agent);
  };

  return (
    <AgentContext.Provider value={{ agents, activeAgent, setActiveAgent, addAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
}
