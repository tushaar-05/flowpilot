import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useDebounce } from '@/hooks/useDebounce';
import { SEARCHABLE_PAGES } from '@/constants';
import type { Task, Project, User, FileItem } from '@/types';

interface SearchResults {
  pages: (typeof SEARCHABLE_PAGES)[number][];
  tasks: Task[];
  projects: Project[];
  team: User[];
  files: FileItem[];
}
// Limit the number of results per group to avoid overwhelming the user
const RESULTS_PER_GROUP = 4;

export function useGlobalSearch() {
  const { tasks, projects, users, files } = useApp();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);//wait for 200ms after the user stops typing before updating the debounced query
  // Compute the search results based on the debounced query and the available data
  const results = useMemo<SearchResults>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return { pages: [], tasks: [], projects: [], team: [], files: [] };

    return {
      pages: SEARCHABLE_PAGES.filter(
        (p) => p.label.toLowerCase().includes(q) || p.keywords.includes(q)
      ).slice(0, RESULTS_PER_GROUP),
      tasks: tasks
        .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
        .slice(0, RESULTS_PER_GROUP),
      projects: projects
        .filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        .slice(0, RESULTS_PER_GROUP),
      team: users
        .filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q)
        )
        .slice(0, RESULTS_PER_GROUP),
      files: files
        .filter((f) => f.size > 0 && f.name.toLowerCase().includes(q))
        .slice(0, RESULTS_PER_GROUP),
    };
  }, [debouncedQuery, tasks, projects, users, files]);
// Determine if there is a query and if there are any results to display
  const hasQuery = debouncedQuery.trim().length > 0;
  const hasResults =
    results.pages.length > 0 ||
    results.tasks.length > 0 ||
    results.projects.length > 0 ||
    results.team.length > 0 ||
    results.files.length > 0;

  return { query, setQuery, debouncedQuery, results, hasQuery, hasResults };
}