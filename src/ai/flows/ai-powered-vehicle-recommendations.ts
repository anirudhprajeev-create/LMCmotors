
'use server';
/**
 * @fileOverview AI-powered vehicle recommendation flow.
 *
 * This file defines a Genkit flow that takes user preferences as input and returns vehicle recommendations.
 *
 * @exports vehicleRecommendations - The main function to get vehicle recommendations.
 * @exports VehicleRecommendationsInput - The input type for the vehicleRecommendations function.
 * @exports VehicleRecommendationsOutput - The output type for the vehicleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fetchVehicles } from '@/lib/data';

const VehicleRecommendationsInputSchema = z.object({
  budget: z.number().describe('The budget for the vehicle in USD.'),
  type: z.string().describe('The desired type of vehicle (e.g., Sedan, Sports, SUV, Coupe, Off-road, Supercars, Limited, S, A, B, C, In-game).'),
});
export type VehicleRecommendationsInput = z.infer<typeof VehicleRecommendationsInputSchema>;

const VehicleRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      model: z.string().describe('The model of the recommended vehicle.'),
      price: z.number().describe('The price of the recommended vehicle in USD.'),
      description: z.string().describe('A short description of the vehicle.'),
    })
  ).describe('A list of recommended vehicles.'),
});
export type VehicleRecommendationsOutput = z.infer<typeof VehicleRecommendationsOutputSchema>;


const getVehicleInventory = ai.defineTool(
    {
      name: 'getVehicleInventory',
      description: 'Returns the current vehicle inventory based on type.',
      inputSchema: z.object({
        type: z.string().describe('The type of vehicle to filter by (e.g., Sedan, Sports, SUV, Coupe, Off-road, Supercars, Limited, S, A, B, C, In-game).'),
      }),
      outputSchema: z.array(z.object({
        id: z.number(),
        make: z.string(),
        model: z.string(),
        price: z.number(),
        type: z.string(),
        imageUrl: z.string()
      })),
    },
    async (input) => {
      console.log(`Tool: Fetching vehicles of type: ${input.type}`);
      const vehicles = await fetchVehicles({ type: input.type });
      return vehicles;
    }
)


export async function vehicleRecommendations(input: VehicleRecommendationsInput): Promise<VehicleRecommendationsOutput> {
  return vehicleRecommendationsFlow(input);
}

const vehicleRecommendationsPrompt = ai.definePrompt({
  name: 'vehicleRecommendationsPrompt',
  tools: [getVehicleInventory],
  input: {schema: VehicleRecommendationsInputSchema},
  output: {schema: VehicleRecommendationsOutputSchema},
  prompt: `You are an expert vehicle recommendation system for LMC Motors. Based on the user's specified budget and vehicle type, recommend the most suitable vehicles.
Use the getVehicleInventory tool to get the list of available vehicles of the requested type.
Then, filter those results by the user's budget.
From the filtered list, select up to 3 of the best matches and provide a compelling, short description for each, highlighting why it's a great fit for the user.

Budget: {{{budget}}}
Vehicle Type: {{{type}}}

Return the recommendations in JSON format. If no vehicles match the criteria, return an empty recommendations array.`,
});

const vehicleRecommendationsFlow = ai.defineFlow(
  {
    name: 'vehicleRecommendationsFlow',
    inputSchema: VehicleRecommendationsInputSchema,
    outputSchema: VehicleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await vehicleRecommendationsPrompt(input);
    return output!;
  }
);
