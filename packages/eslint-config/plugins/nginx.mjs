/**
 * ESLint configuration for Nginx configuration files
 * Uses custom processor to handle nginx syntax validation
 */

const nginxConfig = [
  {
    files: ['**/*.conf', '**/nginx.conf', '**/*.nginx.conf'],
    
    processor: {
      preprocess(text, filename) {
        // Basic nginx syntax validation
        const lines = text.split('\n');
        const errors = [];
        let inMultiLineDirective = false;
        let currentDirective = '';
        
        lines.forEach((line, index) => {
          const trimmed = line.trim();
          
          // Check for common nginx syntax issues
          if (trimmed && !trimmed.startsWith('#')) {
            // Detect start of multi-line directive
            if (trimmed.match(/^(gzip_types|proxy_set_header|add_header)$/)) {
              inMultiLineDirective = true;
              currentDirective = trimmed;
              return; // Don't check semicolon for multi-line directive start
            }
            
            // Check if we're ending a multi-line directive
            if (inMultiLineDirective && trimmed.endsWith(';')) {
              inMultiLineDirective = false;
              currentDirective = '';
              return;
            }
            
            // Skip validation if we're inside a multi-line directive
            if (inMultiLineDirective) {
              return;
            }
            
            // Check for missing semicolons in single-line directives
            if (trimmed.match(/^(listen|server_name|root|index|try_files|return|rewrite|proxy_pass|gzip|sendfile)/) && 
                !trimmed.endsWith(';') && 
                !trimmed.endsWith('{') && 
                !trimmed.endsWith('}')) {
              errors.push({
                line: index + 1,
                message: `Missing semicolon in directive: ${trimmed}`
              });
            }
            
            // Check for unmatched braces  
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;
            if (openBraces !== closeBraces && openBraces > 0 && closeBraces > 0) {
              errors.push({
                line: index + 1,
                message: `Unmatched braces in line: ${trimmed}`
              });
            }
          }
        });
        
        // Log validation errors (in development)
        if (errors.length > 0 && process.env.NODE_ENV !== 'production') {
          console.warn(`⚠️  Nginx syntax issues found in ${filename}:`);
          errors.forEach(error => {
            console.warn(`  Line ${error.line}: ${error.message}`);
          });
        }
        
        // Convert nginx config to JavaScript comments to avoid parsing errors
        const jsContent = text
          .split('\n')
          .map(line => `// ${line}`)
          .join('\n');
        
        return [jsContent];
      },
      
      postprocess(messages) {
        return messages.flat();
      }
    },
    
    rules: {
      // Basic formatting rules
      'max-len': ['error', { 
        code: 230, 
        comments: 230,
        ignoreUrls: true,
        ignoreStrings: true 
      }],
    }
  }
];

export default nginxConfig;