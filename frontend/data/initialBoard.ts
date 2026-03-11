import type { Board } from '@/types/kanban'

const INITIAL_BOARD: Board = [
  {
    id: 'col-1',
    name: 'Backlog',
    cards: [
      {
        id: 'card-01',
        title: 'Design system audit',
        details: 'Review all existing components for consistency with the new brand guidelines.',
      },
      {
        id: 'card-02',
        title: 'Write API contract',
        details: 'Define request/response shapes for all endpoints before implementation begins.',
      },
      {
        id: 'card-03',
        title: 'Stakeholder interviews',
        details: 'Schedule and conduct 30-minute sessions with each department head.',
      },
    ],
  },
  {
    id: 'col-2',
    name: 'Ready',
    cards: [
      {
        id: 'card-04',
        title: 'Set up CI pipeline',
        details: 'Configure GitHub Actions for lint, test, and build on every pull request.',
      },
      {
        id: 'card-05',
        title: 'Database schema review',
        details: 'Validate entity relationships and index strategy with the data team.',
      },
    ],
  },
  {
    id: 'col-3',
    name: 'In Progress',
    cards: [
      {
        id: 'card-06',
        title: 'Authentication module',
        details: 'Implement JWT-based login and refresh token rotation.',
      },
      {
        id: 'card-07',
        title: 'Dashboard layout',
        details: 'Build the responsive grid shell that all dashboard widgets will live inside.',
      },
    ],
  },
  {
    id: 'col-4',
    name: 'Review',
    cards: [
      {
        id: 'card-08',
        title: 'Payment integration',
        details: 'Stripe checkout flow with webhook handling for subscription events.',
      },
    ],
  },
  {
    id: 'col-5',
    name: 'Done',
    cards: [
      {
        id: 'card-09',
        title: 'Project kickoff',
        details: 'Aligned on goals, timeline, and team responsibilities.',
      },
      {
        id: 'card-10',
        title: 'Environment provisioning',
        details: 'Dev, staging, and production environments are live with secrets in place.',
      },
    ],
  },
]

export default INITIAL_BOARD
