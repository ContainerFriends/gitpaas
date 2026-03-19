import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../models/project.models';

/**
 * Project repository
 */
export interface ProjectRepository {
    /**
     * Get all projects
     *
     * @returns List of projects
     */
    getAll: () => Promise<Project[]>;

    /**
     * Get project by ID
     *
     * @param id Project ID
     *
     * @returns Project or null if not found
     */
    getById: (id: string) => Promise<Project | null>;

    /**
     * Create a project
     *
     * @param createDto Project creation data
     *
     * @returns Created project
     */
    create: (createDto: CreateProjectDto) => Promise<Project>;

    /**
     * Update a project
     *
     * @param updateDto Project update data
     *
     * @returns Updated project or null if not found
     */
    update: (updateDto: UpdateProjectDto) => Promise<Project | null>;

    /**
     * Delete a project
     *
     * @param id Project ID
     *
     * @returns Whether project was deleted
     */
    delete: (id: string) => Promise<boolean>;
}
