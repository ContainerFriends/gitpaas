/**
 * Project status enumeration representing the different states a project can be in.
 */
export type ProjectStatus = 'running' | 'stopped' | 'deploying' | 'error';

/**
 * Project domain model representing a deployable project in the system.
 */
export interface Project {
    /**
     * Unique identifier for the project.
     */
    id: string;

    /**
     * Human-readable name of the project.
     */
    name: string;

    /**
     * Technology type or framework used by the project.
     */
    type: string;

    /**
     * Current deployment status of the project.
     */
    status: ProjectStatus;

    /**
     * Domain or URL where the project is accessible.
     */
    domain: string;

    /**
     * Git branch currently deployed.
     */
    branch: string;

    /**
     * Human-readable timestamp of the last deployment.
     */
    lastDeploy: string;

    /**
     * Total number of deployments made for this project.
     */
    deployCount: number;
}

/**
 * Configuration mappings for project status display.
 */
export const ProjectStatusConfig = {
    /**
     * CSS classes for status indicator dots.
     */
    statusDot: {
        running: 'status-dot-running',
        deploying: 'status-dot-deploying',
        error: 'status-dot-error',
        stopped: 'status-dot-stopped',
    } as Record<ProjectStatus, string>,

    /**
     * Human-readable labels for status.
     */
    statusLabel: {
        running: 'Running',
        deploying: 'Deploying',
        error: 'Error',
        stopped: 'Stopped',
    } as Record<ProjectStatus, string>,

    /**
     * CSS classes for status text color.
     */
    statusText: {
        running: 'text-success',
        deploying: 'text-warning',
        error: 'text-destructive',
        stopped: 'text-muted-foreground',
    } as Record<ProjectStatus, string>,
} as const;