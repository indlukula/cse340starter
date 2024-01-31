-- Insert data into account table
INSERT INTO account 
VALUES (1, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update account table
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete data from account table
DELETE FROM account
WHERE account_id = 1;

--Replace data in account table
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Join classification and inventory tables
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Update the image and thumbnail columns
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
