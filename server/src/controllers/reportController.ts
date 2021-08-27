import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import * as dbUtil from './../utils/dbUtil';

interface Report {
    year: number,
    caregivers: {
        name: string,
        patients: string[]
    }[]
}

export const getReport = async (req: Request, res: Response) => {

    
    const sql = `
    SELECT
        caregiver.name    AS caregiver_name,
        array_agg(patient.name)      AS patient_names,
        array_agg(visit.date)       AS visit_date
    FROM caregiver
    JOIN visit ON visit.caregiver = caregiver.id
    JOIN patient ON patient.id = visit.patient
    WHERE date_part('year', visit.date) = ${req.params.year} 
    GROUP BY caregiver.id
`;
//  Change the year to the current year dynamically by req.params.year

    
    let result : QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, []);
        const report: Report = {
            year: parseInt(req.params.year),
            caregivers: []
        };

        for ( let row of result.rows) {
            report.caregivers.push({
                name: row.caregiver_name,
                patients: row.patient_names
            })
        }
        res.status(200).json(report);
    } catch (error) {
        throw new Error(error.message);
    }

}
