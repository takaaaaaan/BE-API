import { CreateAnalystParams, UpdateAnalystParams } from 'types'

import dbConnect from '@/db/dbConnect'
import Analyst from '@/db/models/analyst'
import { handleError } from '@/utils'

/**
 * Create a new analyst
 * @param {CreateAnalystParams} params - Analyst information
 * @returns {Promise<any>} Analyst information
 */
export async function createAnalyst(params: CreateAnalystParams): Promise<any> {
  try {
    await dbConnect()
    const analyst = await Analyst.create(params)
    return analyst
  } catch (error) {
    return handleError(error)
  }
}
/**
 * Update an analyst
 * @param {UpdateAnalystParams} params - Analyst information
 * @returns {Promise<any>} Analyst information
 */
export async function updateAnalyst(params: UpdateAnalystParams): Promise<any> {
  try {
    await dbConnect()
    const analyst = await Analyst.findOneAndUpdate({ email: params.email }, params, { new: true })
    return analyst
  } catch (error) {
    return handleError(error)
  }
}
