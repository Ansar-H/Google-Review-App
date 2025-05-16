function createLogo(container) {
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');

    // Create a circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', '#4365af');
    svg.appendChild(circle);

    // Create a checkmark path
    const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkmark.setAttribute('d', 'M30 50 L45 65 L70 35');
    checkmark.setAttribute('stroke', '#8cc63f');
    checkmark.setAttribute('stroke-width', '10');
    checkmark.setAttribute('fill', 'none');
    checkmark.setAttribute('stroke-linecap', 'round');
    checkmark.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(checkmark);

    // Append SVG to container
    container.appendChild(svg);

    return svg;
}

module.exports = {
    createLogo
};