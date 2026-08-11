import { contactMethods, socialLinks } from '../../data/contacts';
import SectionWrapper from '../ui/SectionWrapper';
import styles from './ContactSection.module.css';

function ContactSection() {
  return (
    <SectionWrapper id="contact">
      <div className={styles.section}>
        <h2 className={styles.title}>Contact</h2>

        <div className={styles.contactGrid}>
          {/* Direct contact methods */}
          <div className={styles.group}>
            <h3 className={styles.groupLabel}>Get in Touch</h3>
            <ul className={styles.linkList}>
              {contactMethods.map((method) => (
                <li key={method.type}>
                  <a
                    href={method.href}
                    className={styles.link}
                    {...(method.type !== 'email' && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {method.label} — {method.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className={styles.group}>
            <h3 className={styles.groupLabel}>Social</h3>
            <ul className={styles.linkList}>
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resume PDF link */}
        <a
          href="/assets/pdf/Tomas Bentolila Resume.pdf"
          className={styles.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Resume (PDF)
        </a>
      </div>
    </SectionWrapper>
  );
}

export default ContactSection;
