import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../models/projects.models';

/**
 * Projects repository
 */
export interface ProjectsRepository {
    /**
     * Get all projects
     *
     * @return List of projects
     */
    getAll: () => Promise<Project[]>;

    /**
     * Get project by ID
     *
     * @param id Project ID
     *
     * @return Project or null if not found
     */
    getById: (id: string) => Promise<Project | null>;

    /**
     * Create a project
     *
     * @param createDto Project creation data
     *
     * @return Created project
     */
    create: (createDto: CreateProjectDto) => Promise<Project>;

    /**
     * Update a project
     *
     * @param id Project ID
     * @param updateDto Project update data
     *
     * @return Updated project
     */
    update: (id: string, updateDto: UpdateProjectDto) => Promise<Project>;

    /**
     * Delete a project
     *
     * @param id Project ID
     *
     * @return Promise that resolves when deletion is complete
     */
    delete: (id: string) => Promise<void>;
}
