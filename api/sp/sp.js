CREATE PROCEDURE GetAllDevices()
BEGIN
    SELECT * FROM custom_device_tableS;
END;

CREATE PROCEDURE GetDeviceById(IN p_device_id VARCHAR(255))
BEGIN
    SELECT * FROM custom_device_tableS WHERE device_id = p_device_id;
END;

CREATE PROCEDURE AddDevice(IN p_device_id VARCHAR(255), IN p_device_name VARCHAR(255), IN p_password VARCHAR(255), IN p_device_type VARCHAR(255), IN p_url VARCHAR(255), IN p_ip VARCHAR(15), IN p_port VARCHAR(10), IN p_suffix VARCHAR(255))
BEGIN
    INSERT INTO custom_device_tableS (device_id, device_name, password, device_type, url, ip, port, suffix) 
    VALUES (p_device_id, p_device_name, p_password, p_device_type, p_url, p_ip, p_port, p_suffix);
END;

CREATE PROCEDURE UpdateDevice(IN p_device_id VARCHAR(255), IN p_device_name VARCHAR(255), IN p_password VARCHAR(255), IN p_device_type VARCHAR(255), IN p_url VARCHAR(255), IN p_ip VARCHAR(15), IN p_port VARCHAR(10), IN p_suffix VARCHAR(255))
BEGIN
    UPDATE custom_device_tableS 
    SET device_name = p_device_name, password = p_password, device_type = p_device_type, url = p_url, ip = p_ip, port = p_port, suffix = p_suffix 
    WHERE device_id = p_device_id;
END;

CREATE PROCEDURE DeleteDevice(IN p_device_id VARCHAR(255))
BEGIN
    DELETE FROM custom_device_tableS WHERE device_id = p_device_id;
END;
