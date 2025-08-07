export const createStoryPrompt = ({ characters, location, description, genre, tone, length }) => {
  const genreDescriptions = {
    aventura: 'una emocionante aventura llena de acción y descubrimientos',
    fantasia: 'una historia mágica con elementos fantásticos y sobrenaturales',
    misterio: 'un intrigante misterio que debe ser resuelto paso a paso',
    amistad: 'una conmovedora historia sobre la amistad y los vínculos humanos',
    comedia: 'una historia divertida y llena de humor que haga reír',
    'ciencia-ficcion': 'una historia futurista con elementos de ciencia ficción',
    terror: 'una historia de terror apropiada para la audiencia, con suspenso',
    romance: 'una hermosa historia de amor y romance'
  };

  const toneDescriptions = {
    infantil: 'Usa un lenguaje simple y apropiado para niños, con mensaje positivo',
    juvenil: 'Usa un lenguaje dinámico apropiado para adolescentes',
    adulto: 'Usa un lenguaje más sofisticado y temas maduros',
    familiar: 'Usa un lenguaje que toda la familia pueda disfrutar'
  };

  const lengthDescriptions = {
    corto: 'aproximadamente 200-300 palabras',
    medio: 'aproximadamente 400-600 palabras',
    largo: 'aproximadamente 700-1000 palabras'
  };

  return `
Eres un escritor experto en crear cuentos cautivadores. Crea ${genreDescriptions[genre]} con las siguientes especificaciones:

**PERSONAJES:** ${characters}
**LUGAR:** ${location}
**DESCRIPCIÓN DE LA HISTORIA:** ${description}
**GÉNERO:** ${genre}
**TONO:** ${toneDescriptions[tone]}
**LONGITUD:** ${lengthDescriptions[length]}

**INSTRUCCIONES ESPECÍFICAS:**
1. Crea una historia completa con inicio, desarrollo y final satisfactorio
2. Incluye diálogos naturales y descripciones vívidas
3. Desarrolla los personajes de manera que el lector se conecte con ellos
4. Mantén un ritmo narrativo apropiado para el género seleccionado
5. Asegúrate de que la historia sea coherente y fluya naturalmente
6. Incluye elementos específicos del género (${genre})
7. El tono debe ser ${tone} durante toda la historia
8. La historia debe tener exactamente ${lengthDescriptions[length]}

**FORMATO DE RESPUESTA:**
- Inicia con un título atractivo
- Organiza la historia en párrafos bien estructurados
- Usa puntuación y ortografía correctas
- Termina con una conclusión satisfactoria

¡Crea una historia memorable que capture la imaginación del lector!
`;
};