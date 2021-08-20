const vertexShader = `
    attribute vec3 position;
    uniform mat4 modelTransform;
    uniform mat4 worldViewProjection;

    varying vec3 worldPosition;
    varying vec4 projectedPosition;

    void main() {
        vec4 worldPosition4 = modelTransform * vec4(position, 1.0);
        worldPosition = vec3(worldPosition4);
        projectedPosition = gl_Position = worldViewProjection * worldPosition4;
    }
`
export default vertexShader
