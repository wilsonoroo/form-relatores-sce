"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  FormHelperText,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { storage, db } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

const JobApplicationForm = () => {
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [certFileInputs, setCertFileInputs] = useState<Array<File[]>>([[]]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Nombre es requerido"),
    lastName: Yup.string().required("Apellidos son requeridos"),
    city: Yup.string().required("Ciudad de residencia es requerida"),
    phone: Yup.string().required("Número de teléfono es requerido"),
    email: Yup.string().email("Correo inválido").required("Correo es requerido"),
    message: Yup.string().required("Mensaje es requerido"),
    options: Yup.array().of(Yup.string()).required("Debes seleccionar al menos una opción"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (index === -1) {
        setCvFiles(files);
      } else {
        setCertFileInputs((prevInputs) => {
          const newInputs = [...prevInputs];
          newInputs[index] = files;
          return newInputs;
        });
      }
    }
  };

  const handleRemoveFile = (certIndex: number, fileIndex: number) => {
    if (certIndex === -1) {
      setCvFiles([]);
    } else {
      setCertFileInputs((prevInputs) => {
        const newInputs = [...prevInputs];
        const files = newInputs[certIndex];
        newInputs[certIndex] = files.filter((_, i) => i !== fileIndex);
        return newInputs;
      });
    }
  };

  const handleAddCertificate = () => {
    setCertFileInputs((prevInputs) => [...prevInputs, []]);
  };

  const handleRemoveCertificate = (index: number) => {
    setCertFileInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: any) => {
    try {
      const userEmail = values.email;
      const userDocRef = doc(db, "users", userEmail);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        alert("El usuario ya está registrado.");
        return;
      }

      const certURLs: string[] = [];

      for (const certFileArray of certFileInputs) {
        for (const certFile of certFileArray) {
          const certStorageRef = ref(storage, `${userEmail}/certFiles/${certFile.name}`);
          await uploadBytes(certStorageRef, certFile);
          const certURL = await getDownloadURL(certStorageRef);
          certURLs.push(certURL);
        }
      }

      let cvURL = "";
      if (cvFiles.length > 0) {
        const cvFile = cvFiles[0];
        const cvStorageRef = ref(storage, `${userEmail}/cvFiles/${cvFile.name}`);
        await uploadBytes(cvStorageRef, cvFile);
        cvURL = await getDownloadURL(cvStorageRef);
      }

      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        city: values.city,
        phone: values.phone,
        email: values.email,
        message: values.message,
        options: values.options,
        cvFiles: cvURL,
        certFiles: certURLs,
      };

      await setDoc(userDocRef, userData);

      alert("Formulario enviado con éxito.");

    } catch (error) {
      console.error("Error al enviar el formulario: ", error);
      alert("Hubo un error al enviar el formulario. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        city: "",
        phone: "",
        email: "",
        message: "",
        options: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <Field name="firstName">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </div>
          <div>
            <Field name="lastName">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Apellidos"
                  variant="outlined"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </div>
          <div>
            <Field name="city">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Ciudad de Residencia"
                  variant="outlined"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </div>
          <div>
            <Field name="phone">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Número de Teléfono"
                  variant="outlined"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </div>
          <div>
            <Field name="email">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Correo Electrónico"
                  variant="outlined"
                  type="email"
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </div>
          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="options-label">Opciones</InputLabel>
              <Field
                as={Select}
                name="options"
                multiple
                labelId="options-label"
                id="options"
                label="Opciones"
                onChange={(e: { target: { value: string; }; }) => setFieldValue("options", e.target.value)}
                value={values.options}
              >
                <MenuItem value="A1">A1</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="A3">A3</MenuItem>
                <MenuItem value="B1">B1</MenuItem>
                <MenuItem value="B2">B2</MenuItem>
                <MenuItem value="B3">B3</MenuItem>
              </Field>
              {errors.options && touched.options && (
                <FormHelperText error>{errors.options}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div>
            <Field name="message">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label="Mensaje"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </div>
          <div>
            <InputLabel htmlFor="cv">Adjunta tu CV</InputLabel>
            <input
              type="file"
              id="cv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setCvFiles([file]); // Solo guardamos el primer archivo
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="mt-2">
              {cvFiles.length > 0 && (
                <div className="flex items-center justify-between space-x-2">
                  <span>{cvFiles[0].name}</span>
                  <IconButton onClick={() => handleRemoveFile(-1, 0)} color="error">
                    <RemoveCircleIcon />
                  </IconButton>
                </div>
              )}
            </div>
          </div>

          <div>
            <InputLabel htmlFor="certificates">Adjuntar Certificados</InputLabel>
            {certFileInputs.map((files, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                    multiple
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <IconButton
                    onClick={() => handleRemoveCertificate(index)}
                    color="error"
                    className="ml-2"
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </div>
                <div className="mt-2">
                  {files.map((file, fileIndex) => (
                    <div key={fileIndex} className="flex items-center justify-between space-x-2">
                      <span>{file.name}</span>
                      <IconButton onClick={() => handleRemoveFile(index, fileIndex)} color="error">
                        <RemoveCircleIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handleAddCertificate}
              startIcon={<AddCircleIcon />}
              className="mt-2"
            >
              Añadir otro certificado
            </Button>
          </div>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Enviar
          </Button>
        </Form>
      )}
    </Formik>
  );



};



export default JobApplicationForm;
