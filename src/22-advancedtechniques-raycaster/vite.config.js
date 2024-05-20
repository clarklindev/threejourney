export default {
    root: 'src/',
    publicDir: '../public/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true, // Empty the folder first
        sourcemap: false // Add sourcemap
    },
}