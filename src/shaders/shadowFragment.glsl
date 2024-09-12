varying vec2 vUv;

uniform float shadowRadius;
uniform float shadowOpacity;
uniform vec3 shadowColor;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    float shadow = smoothstep(0.0, shadowRadius, dist);
    gl_FragColor = vec4(shadowColor, (1.0 - shadow) * shadowOpacity);
}