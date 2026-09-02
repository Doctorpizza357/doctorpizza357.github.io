import styles from './QuickSpecBar.module.css';

interface QuickSpecBarProps {
  /** Tools/technologies used, rendered as pills. */
  tools: string[];
  /** Optional repository or CAD files URL. */
  resourceUrl?: string;
  /** Label for the resource link, e.g. "View on GitHub" / "CAD Files". */
  resourceLabel?: string;
}

/**
 * QuickSpecBar renders a metadata bar for a case study: a set of tool pills
 * sourced from the project's technology list, plus an optional resource link
 * (repository or CAD files URL) that opens in a new browser tab.
 *
 * The resource link is only rendered when `resourceUrl` is defined
 * (Requirement 9.4). Tool pills are always rendered from `tools`
 * (Requirement 9.3).
 */
function QuickSpecBar({ tools, resourceUrl, resourceLabel }: QuickSpecBarProps) {
  return (
    <div className={styles.quickSpecBar} aria-label="Quick specifications">
      <ul className={styles.tools} aria-label="Tools used">
        {tools.map((tool) => (
          <li key={tool} className={styles.toolPill}>
            {tool}
          </li>
        ))}
      </ul>

      {resourceUrl && (
        <a
          className={styles.resourceLink}
          href={resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {resourceLabel ?? 'View Resource'}
          <span className={styles.visuallyHidden}> (opens in new tab)</span>
          <span aria-hidden="true"> →</span>
        </a>
      )}
    </div>
  );
}

export default QuickSpecBar;
export type { QuickSpecBarProps };
