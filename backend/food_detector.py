import tensorflow as tf
import numpy as np
from PIL import Image
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class FoodDetector:
    def __init__(self, model_path: str = "./models/binary_food_detector.h5"):
        """
        Initializes the FoodDetector with a pre-trained binary classification model.
        This model determines if an image contains food or not.

        Args:
            model_path: The path to the pre-trained Keras model file (.h5 or SavedModel format).
                        Expected to be a binary classifier for food/non-food.
        """
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            logger.error(f"Food detection model not found at {self.model_path}. "
                         "Please ensure the model file is placed in the correct location.")
            raise FileNotFoundError(f"Food detection model not found at {self.model_path}")
        
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            logger.info(f"Successfully loaded food detection model from {self.model_path}")
        except Exception as e:
            logger.error(f"Error loading food detection model from {self.model_path}: {e}")
            raise RuntimeError(f"Failed to load food detection model: {e}")

        self.img_height = 224 # Assuming MobileNetV3 input size
        self.img_width = 224  # Assuming MobileNetV3 input size

    def preprocess_image(self, image_path):
        """
        Preprocesses the image for the binary food detection model.
        """
        img = Image.open(image_path).resize((self.img_width, self.img_height))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # Create a batch
        img_array = img_array / 255.0 # Rescale to [0, 1]
        return img_array

    def is_food(self, image_path):
        """
        Predicts whether the given image contains food.
        Returns True if food, False otherwise.
        """
        preprocessed_img = self.preprocess_image(image_path)
        predictions = self.model.predict(preprocessed_img)
        # Assuming binary classification where 0 is food, 1 is non-food
        # A prediction closer to 0 indicates food.
        return predictions[0][0] < 0.5 # Example threshold
