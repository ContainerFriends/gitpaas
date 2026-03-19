import { CreateProjectDto } from '../../domain/dtos/create-project.dto';
import { UpdateProjectDto } from '../../domain/dtos/update-project.dto';
import { Project } from '../../domain/models/projects.models';
import { ProjectsRepository } from '../../domain/repositories/projects.repository';

import { projectsApiMapper } from './projects-api.mapper';
import { ApiProject } from './projects-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Projects API repository
 */
export const projectsApiRepository = (token: string): ProjectsRepository => ({
    getAll: async (): Promise<Project[]> => {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch projects');

        const data: ApiProject[] = await response.json();

        return data.map(projectsApiMapper.toDomain);
    },

    getById: async (id: string): Promise<Project | null> => {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return null;
        }

        await handleHttpError(response, 'fetch project');

        const data: ApiProject = await response.json();

        return projectsApiMapper.toDomain(data);
    },

    create: async (createDto: CreateProjectDto): Promise<Project> => {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...createDto }),
        });

        await handleHttpError(response, 'create project');

        const data: ApiProject = await response.json();

        return projectsApiMapper.toDomain(data);
    },

    update: async (id: string, updateDto: UpdateProjectDto): Promise<Project> => {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...updateDto }),
        });

        await handleHttpError(response, 'update project');

        const data: ApiProject = await response.json();

        return projectsApiMapper.toDomain(data);
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'delete project');
    },
});
