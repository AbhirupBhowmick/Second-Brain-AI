const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'stitch');
const outputDir = path.join(__dirname, 'components');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const html = fs.readFileSync(path.join(inputDir, file), 'utf-8');
    
    // Convert to JSX
    let jsx = html
        // Remove HTML comments
        .replace(/<!--[\s\S]*?-->/g, '')
        // Replace class with className
        .replace(/class="/g, 'className="')
        // Replace for with htmlFor
        .replace(/for="/g, 'htmlFor="')
        // Replace SVG attributes
        .replace(/stroke-width="/g, 'strokeWidth="')
        .replace(/stroke-linecap="/g, 'strokeLinecap="')
        .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
        .replace(/fill-rule="/g, 'fillRule="')
        .replace(/clip-rule="/g, 'clipRule="')
        .replace(/viewbox="/gi, 'viewBox="')
        // Fix inline styles
        .replace(/style="([^"]*)"/g, (match, p1) => {
            const properties = p1.split(';').filter(Boolean);
            const styleObj = {};
            properties.forEach(prop => {
                const parts = prop.split(':');
                const key = parts[0]?.trim();
                const value = parts.slice(1).join(':')?.trim();
                if (key && value) {
                    const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    styleObj[camelKey] = value;
                }
            });
            return `style={${JSON.stringify(styleObj)}}`;
        })
        // Self-close tags
        .replace(/<img(.*?)>/gi, (match, p1) => {
            if (match.endsWith('/>')) return match;
            return `<img${p1} />`;
        })
        .replace(/<input(.*?)>/gi, (match, p1) => {
            if (match.endsWith('/>')) return match;
            return `<input${p1} />`;
        })
        .replace(/<br>/gi, '<br />')
        .replace(/<hr(.*?)>/gi, (match, p1) => {
            if (match.endsWith('/>')) return match;
            return `<hr${p1} />`;
        })
        // fix numeric attributes
        .replace(/rows="(\d+)"/g, 'rows={$1}')
        .replace(/required=""/g, 'required={true}');
        
    // Replace branding text
    const namesToReplace = [
        /CogniGraph/gi, /Digital Brain/gi, /Nexus Note/gi, 
        /AI Powered Digital Brain/gi, /Synapse AI/gi, 
        /Glacier/gi, /hubGlacier/gi, /Cognex/gi, /Memora/gi
    ];
    namesToReplace.forEach(re => {
        jsx = jsx.replace(re, 'Second Brain AI');
    });
    
    // Extract body content
    const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let content = bodyMatch ? bodyMatch[1] : jsx;

    const componentName = file.replace('.html', '');
    
    const componentCode = `export const ${componentName} = () => {
  return (
    <div className="w-full min-h-screen bg-neutral-900">
      ${content}
    </div>
  );
};

export default ${componentName};
`;

    fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), componentCode);
    console.log(`Converted ${file} to ${componentName}.tsx`);
});
