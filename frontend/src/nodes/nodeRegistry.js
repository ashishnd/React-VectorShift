import {
  LogIn,
  LogOut,
  Sparkles,
  Type,
  Filter as FilterIcon,
  Wand2,
  Database,
  Globe,
  StickyNote,
} from 'lucide-react';

// Single source of truth for node metadata.
// Used by both ui.js (defaults for new nodes) and toolbar.js (toolbar entries).

export const NODE_REGISTRY = {
  customInput: {
    label: 'Input',
    displayLabel: 'input',
    icon: LogIn,
    category: 'I/O',
    description: 'Pass data of different types into your workflow',
    defaults: { inputName: 'input_1', inputType: 'Text' },
  },
  customOutput: {
    label: 'Output',
    displayLabel: 'output',
    icon: LogOut,
    category: 'I/O',
    description: 'Surface a final result from the workflow',
    defaults: { outputName: 'output_1', outputType: 'Text' },
  },
  llm: {
    label: 'LLM',
    displayLabel: 'llm',
    icon: Sparkles,
    category: 'AI',
    description: 'Generate a response from a language model',
    defaults: {},
  },
  text: {
    label: 'Text',
    displayLabel: 'text',
    icon: Type,
    category: 'Data',
    description: 'Combine static text with input variables using {{ name }}',
    defaults: { text: '{{input}}' },
  },
  filter: {
    label: 'Filter',
    displayLabel: 'filter',
    icon: FilterIcon,
    category: 'Logic',
    description: 'Pass data through only if it matches a condition',
    defaults: { condition: 'contains', pattern: '' },
  },
  transform: {
    label: 'Transform',
    displayLabel: 'transform',
    icon: Wand2,
    category: 'Logic',
    description: 'Apply a string transformation to incoming data',
    defaults: { operation: 'uppercase' },
  },
  knowledgeBase: {
    label: 'Knowledge Base',
    displayLabel: 'kb',
    icon: Database,
    category: 'Data',
    description: 'Retrieve relevant context from a knowledge base',
    defaults: { kbName: '', topK: 5 },
  },
  apiCall: {
    label: 'API Call',
    displayLabel: 'api',
    icon: Globe,
    category: 'Integration',
    description: 'Make an HTTP request to an external endpoint',
    defaults: { method: 'GET' },
  },
  note: {
    label: 'Note',
    displayLabel: 'note',
    icon: StickyNote,
    category: 'Utility',
    description: 'Annotate your pipeline with context for teammates',
    defaults: { note: '' },
  },
};

export const getDisplayLabel = (nodeType) =>
  NODE_REGISTRY[nodeType]?.displayLabel ?? nodeType;

export const getDefaults = (nodeType) =>
  NODE_REGISTRY[nodeType]?.defaults ?? {};

export const getDescription = (nodeType) =>
  NODE_REGISTRY[nodeType]?.description ?? '';

export const formatNodeBadgeId = (reactFlowId, nodeType) => {
  const displayLabel = getDisplayLabel(nodeType);
  const match = reactFlowId.match(/-(\d+)$/);
  const num = match ? match[1] : '1';
  return `${displayLabel}_${num}`;
};

export const getGroupedNodeEntries = () => {
  const groups = new Map();
  Object.entries(NODE_REGISTRY).forEach(([type, meta]) => {
    if (!groups.has(meta.category)) groups.set(meta.category, []);
    groups.get(meta.category).push({ type, ...meta });
  });
  return Array.from(groups.entries()).map(([category, entries]) => ({
    category,
    entries,
  }));
};
