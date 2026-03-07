/**
 * ESLint configuration for Docker files
 * Provides strict validation and formatting rules for Dockerfile
 */

const dockerConfig = [
  {
    files: ['**/Dockerfile*', '**/*.dockerfile'],
    
    languageOptions: {
      sourceType: 'script'
      // Don't specify parser, let ESLint handle it as text
    },
    
    processor: {
      preprocess(text, filename) {
        // Validate Docker syntax and common best practices
        const lines = text.split('\n');
        const errors = [];
        
        lines.forEach((line, index) => {
          const trimmed = line.trim();
          const lineNumber = index + 1;
          
          if (trimmed && !trimmed.startsWith('#')) {
            // Check for common Dockerfile issues
            
            // 1. Instructions should be uppercase
            const instructionMatch = trimmed.match(/^([a-z]+)\s/);
            if (instructionMatch) {
              errors.push({
                line: lineNumber,
                message: `Dockerfile instruction '${instructionMatch[1]}' should be uppercase`,
                severity: 'error'
              });
            }
            
            // 2. No trailing spaces
            if (line !== line.trimEnd()) {
              errors.push({
                line: lineNumber,
                message: 'Trailing spaces found',
                severity: 'error'
              });
            }
            
            // 3. FROM should specify version tag
            if (trimmed.startsWith('FROM ') && trimmed.includes(':latest')) {
              errors.push({
                line: lineNumber,
                message: 'Avoid using :latest tag, specify explicit version',
                severity: 'error'
              });
            }
            
            // 4. RUN commands should be optimized
            if (trimmed.startsWith('RUN ')) {
              // Check for apt-get without update
              if (trimmed.includes('apt-get install') && !trimmed.includes('apt-get update')) {
                errors.push({
                  line: lineNumber,
                  message: 'RUN apt-get install should be preceded by apt-get update in same command',
                  severity: 'error'
                });
              }
              
              // Check for missing cleanup
              if (trimmed.includes('apt-get') && !trimmed.includes('rm -rf /var/lib/apt/lists/*')) {
                errors.push({
                  line: lineNumber,
                  message: 'apt-get commands should cleanup cache with && rm -rf /var/lib/apt/lists/*',
                  severity: 'error'
                });
              }
            }
            
            // 5. COPY should be preferred over ADD for simple file copies
            if (trimmed.startsWith('ADD ') && !trimmed.includes('http') && !trimmed.includes('.tar')) {
              errors.push({
                line: lineNumber,
                message: 'Use COPY instead of ADD for simple file copies',
                severity: 'error'
              });
            }
            
            // 6. No root user in production
            if (trimmed.startsWith('USER ') && trimmed.includes('root')) {
              errors.push({
                line: lineNumber,
                message: 'Avoid running as root user in production',
                severity: 'error'
              });
            }
          }
        });
        
        // Log validation errors in development
        if (errors.length > 0 && process.env.NODE_ENV !== 'production') {
          console.error(`⚠️  Dockerfile issues found in ${filename}:`);
          errors.forEach(error => {
            console.error(`  Line ${error.line} (${error.severity}): ${error.message}`);
          });
        }
        
        return [text];
      },
      
      postprocess(messages) {
        return messages.flat().filter(message => {
          // Keep most messages but filter parsing errors
          return !message.message.includes('Parsing error');
        });
      }
    },

    rules: {
      // Strict formatting rules
      'max-len': ['error', { 
        code: 120,
        comments: 150,
        ignorePattern: '^(FROM|RUN|COPY|ADD|ENV|LABEL|ARG|WORKDIR|HEALTHCHECK|SHELL)',
        ignoreUrls: true
      }],
      
      // No trailing spaces
      'no-trailing-spaces': 'error',
      
      // Require final newline
      'eol-last': 'error',
      
      // No multiple empty lines
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }]
    }
  }
];

export default dockerConfig;