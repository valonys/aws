import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const BOT_AVATAR =
  'https://raw.githubusercontent.com/achilela/vila_fofoka_analysis/991f4c6e4e1dc7a8e24876ca5aae5228bcdb4dba/Ataliba_Avatar.jpg';
const USER_AVATAR =
  'https://raw.githubusercontent.com/achilela/vila_fofoka_analysis/9904d9a0d445ab0488cf7395cb863cce7621d897/USER_AVATAR.png';

const seededMessages = [
  {
    id: 'msg-1',
    author: 'VaLTwin Copilot',
    role: 'assistant',
    content:
      'Hello Morgan! I have summarized the highest risk corrosion findings and recommended mitigations. I can also pull latest sensor data or draft remediation work orders if needed.',
  },
  {
    id: 'msg-2',
    author: 'Morgan Ellis',
    role: 'user',
    content: 'Summarize the RAG evaluation status for Bedrock vs SageMaker and flag any blockers.',
  },
  {
    id: 'msg-3',
    author: 'VaLTwin Copilot',
    role: 'assistant',
    content:
      'Bedrock Titan is outperforming on tone alignment (+8% vs baseline) while SageMaker fine-tuning offers tighter taxonomy control. Main blocker: IAM policy to access curated corpus bucket.',
  },
];

const CopilotPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <section className="panel" id="copilot">
      <header className="panel-header">
        <h2>VaLTwin Copilot</h2>
        <p>Conversational assistant orchestrating inspection insights, AWS workflows, and reporting tasks.</p>
      </header>
      <div className="copilot-thread">
        {seededMessages.map((message) => (
          <article key={message.id} className={`message message-${message.role}`}>
            <img
              src={message.role === 'assistant' ? BOT_AVATAR : USER_AVATAR}
              alt={`${message.author} avatar`}
            />
            <div>
              <header>
                <span className="message-author">{message.author}</span>
                <span className="message-role">{message.role === 'assistant' ? 'Assistant' : 'Operator'}</span>
              </header>
              <p>{message.content}</p>
            </div>
          </article>
        ))}
      </div>
      <form
        className="copilot-form"
        onSubmit={(event) => {
          event.preventDefault();
          setPrompt('');
        }}
      >
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask the copilot to draft a mitigation plan, orchestrate AWS workflows, or summarize a finding"
          aria-label="Prompt the copilot"
        />
        <button type="submit">
          <FiSend />
          Send
        </button>
      </form>
    </section>
  );
};

export default CopilotPanel;
