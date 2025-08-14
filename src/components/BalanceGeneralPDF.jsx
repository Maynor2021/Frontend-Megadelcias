// src/components/BalanceGeneralPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '2 solid #2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#374151',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 4,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    marginTop: 15,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #d1d5db',
    fontWeight: 'bold',
  },
  tableCell: {
    border: '1px solid #d1d5db',
    padding: '8px 12px',
    textAlign: 'left',
  },
  tableHeaderCell: {
    border: '1px solid #d1d5db',
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  totalRow: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    borderTop: '2px solid #2563eb',
  },
  totalCell: {
    border: '1px solid #d1d5db',
    padding: '8px 12px',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
  note: {
    marginTop: 10,
    fontSize: 10,
    color: '#4b5563',
  },
  subsection: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #d1d5db',
  },
});

// Fuente personalizada (si se desea)
const fonts = {
  Roboto: {
    normal: 'Roboto-Regular',
    bold: 'Roboto-Bold',
    italics: 'Roboto-Italic',
    bolditalics: 'Roboto-BoldItalic',
  },
};

export default function BalanceGeneralPDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Balance General</Text>
          <Text style={styles.subtitle}>Estado de Situación Financiera</Text>
          <Text style={styles.date}>
            Generado el: {new Date(data.fechaGeneracion).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVOS</Text>
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Activos Circulantes</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>Código</View>
                <View style={styles.tableHeaderCell}>Nombre de Cuenta</View>
                <View style={styles.tableHeaderCell}>Monto ($)</View>
              </View>
              {data.activos.circulantes.efectivo > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1100</View>
                  <View style={styles.tableCell}>Efectivo y Equivalentes</View>
                  <View style={styles.tableCell}>${data.activos.circulantes.efectivo.toLocaleString()}</View>
                </View>
              )}
              {data.activos.circulantes.cuentasPorCobrar > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1200</View>
                  <View style={styles.tableCell}>Cuentas por Cobrar</View>
                  <View style={styles.tableCell}>${data.activos.circulantes.cuentasPorCobrar.toLocaleString()}</View>
                </View>
              )}
              {data.activos.circulantes.inventarios > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1300</View>
                  <View style={styles.tableCell}>Inventarios</View>
                  <View style={styles.tableCell}>${data.activos.circulantes.inventarios.toLocaleString()}</View>
                </View>
              )}
              {data.activos.circulantes.otrosActivosCirculantes > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1400</View>
                  <View style={styles.tableCell}>Otros Activos Circulantes</View>
                  <View style={styles.tableCell}>${data.activos.circulantes.otrosActivosCirculantes.toLocaleString()}</View>
                </View>
              )}
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>Total Activos Circulantes</View>
                <View style={styles.totalCell}>${data.activos.circulantes.totalCirculantes.toLocaleString()}</View>
              </View>
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Activos No Circulantes</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>Código</View>
                <View style={styles.tableHeaderCell}>Nombre de Cuenta</View>
                <View style={styles.tableHeaderCell}>Monto ($)</View>
              </View>
              {data.activos.noCirculantes.equipos > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1500</View>
                  <View style={styles.tableCell}>Equipos y Maquinaria</View>
                  <View style={styles.tableCell}>${data.activos.noCirculantes.equipos.toLocaleString()}</View>
                </View>
              )}
              {data.activos.noCirculantes.mobiliario > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1600</View>
                  <View style={styles.tableCell}>Mobiliario y Enseres</View>
                  <View style={styles.tableCell}>${data.activos.noCirculantes.mobiliario.toLocaleString()}</View>
                </View>
              )}
              {data.activos.noCirculantes.edificios > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1700</View>
                  <View style={styles.tableCell}>Edificios</View>
                  <View style={styles.tableCell}>${data.activos.noCirculantes.edificios.toLocaleString()}</View>
                </View>
              )}
              {data.activos.noCirculantes.otrosActivosFijos > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>1800</View>
                  <View style={styles.tableCell}>Otros Activos Fijos</View>
                  <View style={styles.tableCell}>${data.activos.noCirculantes.otrosActivosFijos.toLocaleString()}</View>
                </View>
              )}
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>Total Activos No Circulantes</View>
                <View style={styles.totalCell}>${data.activos.noCirculantes.totalNoCirculantes.toLocaleString()}</View>
              </View>
            </View>
          </View>

          <View style={styles.totalRow}>
            <View style={styles.totalCell}>TOTAL ACTIVOS</View>
            <View style={styles.totalCell}>${data.activos.totalActivos.toLocaleString()}</View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PASIVOS</Text>
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Pasivos Circulantes</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>Código</View>
                <View style={styles.tableHeaderCell}>Nombre de Cuenta</View>
                <View style={styles.tableHeaderCell}>Monto ($)</View>
              </View>
              {data.pasivos.circulantes.cuentasPorPagar > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2100</View>
                  <View style={styles.tableCell}>Cuentas por Pagar</View>
                  <View style={styles.tableCell}>${data.pasivos.circulantes.cuentasPorPagar.toLocaleString()}</View>
                </View>
              )}
              {data.pasivos.circulantes.prestamosCortoPlazo > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2200</View>
                  <View style={styles.tableCell}>Préstamos a Corto Plazo</View>
                  <View style={styles.tableCell}>${data.pasivos.circulantes.prestamosCortoPlazo.toLocaleString()}</View>
                </View>
              )}
              {data.pasivos.circulantes.impuestosPorPagar > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2300</View>
                  <View style={styles.tableCell}>Impuestos por Pagar</View>
                  <View style={styles.tableCell}>${data.pasivos.circulantes.impuestosPorPagar.toLocaleString()}</View>
                </View>
              )}
              {data.pasivos.circulantes.otrosPasivosCirculantes > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2400</View>
                  <View style={styles.tableCell}>Otros Pasivos Circulantes</View>
                  <View style={styles.tableCell}>${data.pasivos.circulantes.otrosPasivosCirculantes.toLocaleString()}</View>
                </View>
              )}
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>Total Pasivos Circulantes</View>
                <View style={styles.totalCell}>${data.pasivos.circulantes.totalCirculantes.toLocaleString()}</View>
              </View>
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Pasivos No Circulantes</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>Código</View>
                <View style={styles.tableHeaderCell}>Nombre de Cuenta</View>
                <View style={styles.tableHeaderCell}>Monto ($)</View>
              </View>
              {data.pasivos.noCirculantes.prestamosLargoPlazo > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2500</View>
                  <View style={styles.tableCell}>Préstamos a Largo Plazo</View>
                  <View style={styles.tableCell}>${data.pasivos.noCirculantes.prestamosLargoPlazo.toLocaleString()}</View>
                </View>
              )}
              {data.pasivos.noCirculantes.hipotecas > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2600</View>
                  <View style={styles.tableCell}>Hipotecas</View>
                  <View style={styles.tableCell}>${data.pasivos.noCirculantes.hipotecas.toLocaleString()}</View>
                </View>
              )}
              {data.pasivos.noCirculantes.otrosPasivosLargoPlazo > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>2700</View>
                  <View style={styles.tableCell}>Otros Pasivos Largo Plazo</View>
                  <View style={styles.tableCell}>${data.pasivos.noCirculantes.otrosPasivosLargoPlazo.toLocaleString()}</View>
                </View>
              )}
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>Total Pasivos No Circulantes</View>
                <View style={styles.totalCell}>${data.pasivos.noCirculantes.totalNoCirculantes.toLocaleString()}</View>
              </View>
            </View>
          </View>

          <View style={styles.totalRow}>
            <View style={styles.totalCell}>TOTAL PASIVOS</View>
            <View style={styles.totalCell}>${data.pasivos.totalPasivos.toLocaleString()}</View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PATRIMONIO</Text>
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Capital</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>Código</View>
                <View style={styles.tableHeaderCell}>Nombre de Cuenta</View>
                <View style={styles.tableHeaderCell}>Monto ($)</View>
              </View>
              {data.patrimonio.capitalSocial > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>3100</View>
                  <View style={styles.tableCell}>Capital Social</View>
                  <View style={styles.tableCell}>${data.patrimonio.capitalSocial.toLocaleString()}</View>
                </View>
              )}
              {data.patrimonio.utilidadesRetenidas > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>3200</View>
                  <View style={styles.tableCell}>Utilidades Retenidas</View>
                  <View style={styles.tableCell}>${data.patrimonio.utilidadesRetenidas.toLocaleString()}</View>
                </View>
              )}
              {data.patrimonio.utilidadDelEjercicio > 0 && (
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>3300</View>
                  <View style={styles.tableCell}>Utilidad del Ejercicio</View>
                  <View style={styles.tableCell}>${data.patrimonio.utilidadDelEjercicio.toLocaleString()}</View>
                </View>
              )}
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>TOTAL PATRIMONIO</View>
                <View style={styles.totalCell}>${data.patrimonio.totalPatrimonio.toLocaleString()}</View>
              </View>
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Ecuación Contable</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>Partida</View>
                <View style={styles.tableHeaderCell}>Monto ($)</View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>ACTIVOS</View>
                <View style={styles.tableCell}>${data.activos.totalActivos.toLocaleString()}</View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>PASIVOS</View>
                <View style={styles.tableCell}>${data.pasivos.totalPasivos.toLocaleString()}</View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>PATRIMONIO</View>
                <View style={styles.tableCell}>${data.patrimonio.totalPatrimonio.toLocaleString()}</View>
              </View>
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>ACTIVOS = PASIVOS + PATRIMONIO</View>
                <View style={styles.totalCell}>${data.activos.totalActivos.toLocaleString()} = ${data.pasivos.totalPasivos.toLocaleString()} + ${data.patrimonio.totalPatrimonio.toLocaleString()}</View>
              </View>
              <View style={styles.totalRow}>
                <View style={styles.totalCell}>BALANCEADO</View>
                <View style={styles.totalCell}>{Math.abs(data.activos.totalActivos - (data.pasivos.totalPasivos + data.patrimonio.totalPatrimonio)) < 0.01 ? '✓' : '✗'}</View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.note}>
            Nota: Los datos mostrados son con fines ilustrativos. Para reportes oficiales, verifique con su contador.
          </Text>
        </View>
      </Page>
    </Document>
  );
}