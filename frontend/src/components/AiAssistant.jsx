import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/api';
import { Bot, User, Send, Sparkles, RotateCcw, Copy, Check, ShieldAlert, Cpu, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Explain all the features of this project in simple language",
  "Why is Random Forest chosen as the primary model?",
  "Which areas in Kharar are high-risk hotspots?",
  "How is the Crime Risk Score mathematically calculated?",
  "How are the models imported and run in the code?",
  "What are the top viva questions my teacher might ask?"
];

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am **CrimeVision AI Copilot**, the tactical decision support and analytical assistant for the **Kharar (Punjab Police Sector)** system.\n\nYou can ask me anything about:\n- 🗺️ **Geospatial Hotspots** & Crime Trends in Kharar\n- 🧠 **ML Models** (Random Forest, XGBoost, Decision Tree)\n- 📐 **Risk Index Calculation** & Feature Weights\n- 💻 **Project Architecture & Source Code Imports**\n- 🎓 **Viva & Teacher Questions Presentation Tips**\n\nClick any suggested topic below or type your question!`,
      category: 'System Initialization',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        "Explain all the features of this project in simple language",
        "Why is Random Forest chosen as the primary model?",
        "Which areas in Kharar are high-risk hotspots?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(text, messages);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response.reply,
          category: response.category,
          timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowups: response.suggestedFollowups || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered a minor network issue querying the Kharar ML database. Please verify the backend server is running on port 5000.",
          category: "System Error",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowups: ["Explain all the features of this project in simple language"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Conversation cleared. I am ready for new queries regarding **CrimeVision** and the **Kharar, Punjab** crime analytics platform.`,
        category: 'Session Reset',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: SUGGESTED_PROMPTS.slice(0, 3)
      }
    ]);
  };

  // Helper to format basic markdown (bold, lists, headings, tables) safely
  const renderFormattedText = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return <h4 key={i} style={{ fontSize: '14px', fontWeight: '700', color: 'var(--gray-900)', margin: '10px 0 6px' }}>{line.replace('### ', '')}</h4>;
      }
      // Heading 4
      if (line.startsWith('#### ')) {
        return <h5 key={i} style={{ fontSize: '13px', fontWeight: '700', color: 'var(--blue)', margin: '8px 0 4px' }}>{line.replace('#### ', '')}</h5>;
      }
      // Table rows
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim().length > 0 && !c.includes('---'));
        if (cells.length === 0) return null;
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', padding: '3px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '12px' }}>
            {cells.map((c, ci) => (
              <span key={ci} style={{ flex: 1, fontWeight: ci === 0 ? '600' : 'normal', color: 'var(--gray-700)' }}>
                {c.trim().replace(/\*\*/g, '')}
              </span>
            ))}
          </div>
        );
      }
      // Bullet items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: '6px', marginLeft: '8px', margin: '3px 0', fontSize: '13px', color: 'var(--gray-700)' }}>
            <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>•</span>
            <span>{renderInlineMarkdown(line.slice(2))}</span>
          </div>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={i} style={{ marginLeft: '6px', margin: '4px 0', fontSize: '13px', color: 'var(--gray-800)' }}>
            {renderInlineMarkdown(line)}
          </div>
        );
      }
      // Blockquotes
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} style={{ borderLeft: '3px solid var(--blue)', paddingLeft: '10px', margin: '6px 0', color: 'var(--gray-600)', fontStyle: 'italic', fontSize: '12px', background: 'var(--gray-50)', padding: '6px 10px', borderRadius: '0 6px 6px 0' }}>
            {renderInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={i} style={{ height: '6px' }} />;
      }
      // Regular paragraph
      return (
        <p key={i} style={{ margin: '4px 0', fontSize: '13px', lineHeight: '1.55', color: 'var(--gray-800)' }}>
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Basic inline bold and code tag parser
  const renderInlineMarkdown = (text) => {
    // Split by code `...`
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} style={{ background: 'var(--gray-100)', color: 'var(--blue)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ color: 'var(--gray-900)' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: '580px', marginBottom: '24px' }}>
      {/* Assistant Header */}
      <div className="card-header" style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Bot size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--gray-900)' }}>CrimeVision AI Assistant</span>
              <span style={{
                background: 'var(--risk-low-bg)',
                color: 'var(--risk-low)',
                border: '1px solid var(--risk-low-border)',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                ML Copilot Active
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>
              Jurisdiction: Kharar, SAS Nagar (Mohali), Punjab · Model Engine: Scikit-Learn & XGBoost
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleReset}
            className="btn btn-secondary"
            title="Reset conversation"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <RotateCcw size={13} />
            Reset Chat
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div style={{ padding: '10px 20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <Sparkles size={12} color="var(--blue)" />
          Quick Topics:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--gray-200)',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--gray-700)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                flexDirection: isUser ? 'row-reverse' : 'row',
                maxWidth: '90%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: isUser ? 'var(--navy)' : 'var(--blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {isUser ? <User size={15} /> : <Bot size={15} />}
              </div>

              {/* Message Bubble Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '100%' }}>
                {/* Meta Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--gray-400)', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontWeight: '600', color: isUser ? 'var(--gray-700)' : 'var(--blue)' }}>
                    {isUser ? 'You' : 'CrimeVision AI'}
                  </span>
                  {msg.category && (
                    <span style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>
                      {msg.category}
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    background: isUser ? 'var(--navy)' : 'var(--white)',
                    color: isUser ? '#FFFFFF' : 'var(--gray-900)',
                    border: isUser ? 'none' : '1px solid var(--gray-200)',
                    borderRadius: isUser ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                    padding: '14px 16px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}
                >
                  {isUser ? (
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>{msg.text}</p>
                  ) : (
                    <div>
                      {renderFormattedText(msg.text)}

                      {/* Copy Action button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--gray-100)' }}>
                        <button
                          onClick={() => handleCopy(msg.text, i)}
                          className="btn btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '11px', gap: '4px' }}
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check size={11} color="var(--risk-low)" />
                              <span style={{ color: 'var(--risk-low)' }}>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy Brief</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inline follow-up pills for bot message */}
                {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {msg.suggestedFollowups.map((followup, fi) => (
                      <button
                        key={fi}
                        onClick={() => handleSend(followup)}
                        disabled={loading}
                        style={{
                          background: 'var(--gray-100)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '3px 10px',
                          fontSize: '11px',
                          color: 'var(--blue)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>↳</span> {followup}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking State */}
        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', maxWidth: '80%' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0
              }}
            >
              <Bot size={15} />
            </div>
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '2px 12px 12px 12px',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue)', animation: 'pulse 1s infinite alternate' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue)', animation: 'pulse 1s infinite alternate', animationDelay: '0.2s' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue)', animation: 'pulse 1s infinite alternate', animationDelay: '0.4s' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontStyle: 'italic' }}>
                Analyzing Kharar crime database & querying Random Forest model...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gray-200)', background: 'var(--white)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
        >
          <input
            type="text"
            placeholder="Ask anything about models, Kharar hotspots, features, or project code..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="form-control"
            style={{ fontSize: '13px', padding: '10px 14px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn btn-primary"
            style={{ padding: '10px 18px', gap: '6px' }}
          >
            <Send size={14} />
            <span>Send</span>
          </button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
            💡 Tip: Ask "What will my teacher ask in viva?" or "Explain the risk calculation"
          </span>
          <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
            CrimeVision AI Copilot v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
