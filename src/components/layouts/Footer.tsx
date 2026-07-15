export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted">
        <p>&copy; 2024 FlowPilot. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <a href="#" className="hover:text-foreground transition-colors">Support</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
