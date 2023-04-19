import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import { AddressGet } from "../axios/AddresApi";

export const ListAddress = () => {
  const [Data, SetData] = useState([]);
  const [Edit, SetEdit] = useState(false);
  const [error, setError] = useState(false);

  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
  });

  const [EditData, setEditData] = useState({
    Edit_nombre: "",
    Edit_apellido: "",
    Edit_telefono: "",
    Edit_direccion: "",
  });

  const HandleInputChange = (Event) => {
    Edit === false
      ? setDatos({ ...datos, [Event.target.name]: Event.target.value })
      : setEditData({ ...EditData, [Event.target.name]: Event.target.value });
  };

  //Get Event
  const GetData = async () => {
    const resp = await AddressGet.get("/contactos");
    SetData(resp["data"]);
  };

  useEffect(() => {
    GetData();
  }, []);

  /*delete Event*/
  const Delete = async (id) => {
    const resp = await AddressGet.delete(`/contactos/${id}`);
    if (resp.status === 200) {
      GetData();
    }
    console.log(resp);
  };

  //Post Event
  const SetFormButton = async () => {
    //validacion
    if (
      [
        datos["nombre"],
        datos["apellido"],
        datos["telefono"],
        datos["direccion"],
      ].includes("")
    ) {
      setError(true);
    } else {
      setError(false);
      const resp = await AddressGet.post("/contactos", {
        nombre: datos["nombre"],
        apellido: datos["apellido"],
        telefono: datos["telefono"],
        direccion: datos["direccion"],
      });
      if (resp.status === 201) {
        GetData();
        setDatos({ nombre: "", apellido: "", telefono: "", direccion: "" });

      }
    }
  };

  /*put Event*/
  const GetDataEdit = async (ID) => {
    if (Edit === false) {
      SetEdit(!Edit);
    } else if (Edit === true) {
      SetDataEdit(ID);
    }
  };

  const SetDataEdit = async (id) => {
    console.log(id);
    const newData = {
      nombre: EditData["Edit_nombre"] || Data.find(d => d.id === id).nombre,
      apellido: EditData["Edit_apellido"] || Data.find(d => d.id === id).apellido,
      telefono: EditData["Edit_telefono"] || Data.find(d => d.id === id).telefono,
      direccion: EditData["Edit_direccion"] || Data.find(d => d.id === id).direccion,
    };
    const resp = await AddressGet.put(`/contactos/${id}`, newData);
    if (resp.status === 200) {
      SetEdit(!Edit);
      GetData();
    }
  };
  
  return (
    <Container fluid responsive>
      <h1 className="title">Clientes</h1>
      <Card className="m-5 customCard">
        <Row className="p-5">
          <Col xs={5} className="formulario">
            <Form.Group className="mb-3">
              <h2>Formulario</h2>
              {error && (
                <Alert className="alert" variant="danger">
                  Todos los campos son necesarios
                </Alert>
              )}
              <Form.Control
                className="input"
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={datos.nombre}
                onChange={HandleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                className="input"
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={datos.apellido}
                onChange={HandleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                className="input"
                type="number"
                name="telefono"
                placeholder="Telefono"
                value={datos.telefono}
                onChange={HandleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                className="input"
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={datos.direccion}
                onChange={HandleInputChange}
              />
            </Form.Group>
            <Button
              type="submit"
              className="btn-submit"
              variant="dark"
              onClick={() => SetFormButton()}
            >
              Guardar
            </Button>
          </Col>

          <Col sm={7} className="listado">
            <h2>Listado</h2>
            <Card className="list">
              <Table borderless responsive>
                {Data.length === 0 && <p>Cargando...</p>}
                <thead>
                  <>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Telefono</th>
                    <th>Dirección</th>
                    <th></th>
                  </>
                </thead>
                {Data.map((p, i) => {
                  return (
                    <tbody key={i}>
                      <tr key={i}>
                        {Edit === false ? (
                          <React.Fragment>
                            <td>{p.nombre}</td>
                            <td>{p.apellido}</td>
                            <td>{p.telefono}</td>
                            <td>{p.direccion}</td>
                            <td>
                              <Button
                                className="btn-action green"
                                variant="dark"
                                onClick={() => GetDataEdit(p.id)}
                              >
                                Editar
                              </Button>
                            </td>
                            <td>
                              <Button
                                className="btn-action red"
                                variant="dark"
                                onClick={() => Delete(p.id)}
                              >
                                Eliminar
                              </Button>
                            </td>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <td>
                              {" "}
                              <Form.Control
                                className="input"
                                type="text"
                                name="Edit_nombre"
                                onChange={HandleInputChange}
                                placeholder={p.nombre}
                              />
                            </td>

                            <td>
                              <Form.Control
                                className="input"
                                type="text"
                                name="Edit_apellido"
                                onChange={HandleInputChange}
                                placeholder={p.apellido}
                              />
                            </td>

                            <td>
                              <Form.Control
                                className="input"
                                type="text"
                                name="Edit_telefono"
                                onChange={HandleInputChange}
                                placeholder={p.telefono}
                              />
                            </td>

                            <td>
                              <Form.Control
                                className="input"
                                type="text"
                                name="Edit_direccion"
                                onChange={HandleInputChange}
                                placeholder={p.direccion}
                              />
                            </td>
                            <td>
                              <Button
                                className="btn-action green"
                                variant="dark"
                                onClick={() => SetDataEdit(p.id)}
                              >
                                Guardar
                              </Button>
                            </td>
                          </React.Fragment>
                        )}
                      </tr>
                    </tbody>
                  );
                })}
              </Table>
            </Card>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};
