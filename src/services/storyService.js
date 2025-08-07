// src/services/storyService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  orderBy, 
  query,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";

// Colección donde se guardarán los cuentos
const COLLECTION_NAME = "cuentos";

/**
 * Guarda un cuento en Firebase
 * @param {Object} storyData - Datos del cuento
 * @param {string} storyData.story - Texto del cuento
 * @param {Object} storyData.formData - Datos del formulario original
 * @param {string} storyData.title - Título del cuento (opcional)
 * @returns {Promise<string>} ID del documento creado
 */
export const saveStory = async (storyData) => {
  try {
    const { story, formData, title } = storyData;
    
    // Crear un título automático si no se proporciona
    const autoTitle = title || `Cuento ${formData.cultura || 'Cultural'} - ${new Date().toLocaleDateString()}`;
    
    const docData = {
      title: autoTitle,
      story: story,
      formData: formData,
      createdAt: serverTimestamp(),
      wordCount: story.split(' ').length,
      culture: formData.cultura || 'No especificada',
      storyType: formData.tipoHistoria || 'No especificado'
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    console.log("Cuento guardado con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error guardando el cuento: ", error);
    throw new Error("No se pudo guardar el cuento: " + error.message);
  }
};

/**
 * Obtiene todos los cuentos guardados
 * @returns {Promise<Array>} Lista de cuentos
 */
export const getStoriesFromFirebase = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const stories = [];
    
    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return stories;
  } catch (error) {
    console.error("Error obteniendo los cuentos: ", error);
    throw new Error("No se pudieron cargar los cuentos: " + error.message);
  }
};

/**
 * Elimina un cuento por su ID
 * @param {string} storyId - ID del cuento a eliminar
 * @returns {Promise<void>}
 */
export const deleteStory = async (storyId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, storyId));
    console.log("Cuento eliminado: ", storyId);
  } catch (error) {
    console.error("Error eliminando el cuento: ", error);
    throw new Error("No se pudo eliminar el cuento: " + error.message);
  }
};

/**
 * Obtiene estadísticas básicas de los cuentos
 * @returns {Promise<Object>} Estadísticas
 */
export const getStoriesStats = async () => {
  try {
    const stories = await getStoriesFromFirebase();
    
    const stats = {
      total: stories.length,
      cultures: {},
      storyTypes: {},
      totalWords: 0,
      averageWords: 0
    };
    
    stories.forEach(story => {
      // Contar por cultura
      const culture = story.culture || 'No especificada';
      stats.cultures[culture] = (stats.cultures[culture] || 0) + 1;
      
      // Contar por tipo
      const type = story.storyType || 'No especificado';
      stats.storyTypes[type] = (stats.storyTypes[type] || 0) + 1;
      
      // Contar palabras
      stats.totalWords += story.wordCount || 0;
    });
    
    stats.averageWords = stories.length > 0 ? Math.round(stats.totalWords / stories.length) : 0;
    
    return stats;
  } catch (error) {
    console.error("Error obteniendo estadísticas: ", error);
    return {
      total: 0,
      cultures: {},
      storyTypes: {},
      totalWords: 0,
      averageWords: 0
    };
  }
};