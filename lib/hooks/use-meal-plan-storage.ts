'use client'

import { useState, useEffect, useCallback } from 'react'
import { SavedMealPlan, MealIngredient, MealPlanStorage } from '@/lib/types'

const STORAGE_KEY = 'nutrijama-meal-plans'
const EXPIRATION_HOURS = 12

export function useMealPlanStorage() {
  const [storage, setStorage] = useState<MealPlanStorage>({ plans: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: MealPlanStorage = JSON.parse(saved)
        
        // Filter out expired plans
        const now = new Date()
        const validPlans = parsed.plans.filter(plan => 
          new Date(plan.expiresAt) > now
        )
        
        const cleanedStorage: MealPlanStorage = {
          ...parsed,
          plans: validPlans,
          currentPlan: parsed.currentPlan && 
            new Date(parsed.currentPlan.expiresAt) > now 
            ? parsed.currentPlan 
            : undefined
        }
        
        setStorage(cleanedStorage)
        
        // Save cleaned storage back if we removed expired plans
        if (validPlans.length !== parsed.plans.length || 
            (parsed.currentPlan && !cleanedStorage.currentPlan)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedStorage))
        }
      }
    } catch (error) {
      console.error('Error loading meal plans from localStorage:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever storage changes
  const saveToStorage = useCallback((newStorage: MealPlanStorage) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage))
      setStorage(newStorage)
    } catch (error) {
      console.error('Error saving meal plans to localStorage:', error)
    }
  }, [])

  // Create a new meal plan
  const saveMealPlan = useCallback((name: string, ingredients: MealIngredient[]) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + EXPIRATION_HOURS * 60 * 60 * 1000)
    
    const newPlan: SavedMealPlan = {
      id: `meal-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      ingredients: ingredients.map(ing => ({ 
        ...ing, 
        id: ing.id || `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    }

    const newStorage: MealPlanStorage = {
      ...storage,
      plans: [...storage.plans, newPlan],
      currentPlan: newPlan
    }

    saveToStorage(newStorage)
    return newPlan
  }, [storage, saveToStorage])

  // Load an existing meal plan
  const loadMealPlan = useCallback((planId: string) => {
    const plan = storage.plans.find(p => p.id === planId)
    if (plan) {
      const newStorage: MealPlanStorage = {
        ...storage,
        currentPlan: plan
      }
      saveToStorage(newStorage)
      return plan
    }
    return null
  }, [storage, saveToStorage])

  // Delete a meal plan
  const deleteMealPlan = useCallback((planId: string) => {
    const newStorage: MealPlanStorage = {
      ...storage,
      plans: storage.plans.filter(p => p.id !== planId),
      currentPlan: storage.currentPlan?.id === planId ? undefined : storage.currentPlan
    }
    saveToStorage(newStorage)
  }, [storage, saveToStorage])

  // Update current meal plan
  const updateCurrentPlan = useCallback((ingredients: MealIngredient[]) => {
    if (!storage.currentPlan) return

    const updatedPlan: SavedMealPlan = {
      ...storage.currentPlan,
      ingredients: ingredients.map(ing => ({ 
        ...ing, 
        id: ing.id || `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    }

    const newStorage: MealPlanStorage = {
      ...storage,
      plans: storage.plans.map(p => p.id === updatedPlan.id ? updatedPlan : p),
      currentPlan: updatedPlan
    }

    saveToStorage(newStorage)
  }, [storage, saveToStorage])

  // Clear current plan (start fresh)
  const clearCurrentPlan = useCallback(() => {
    const newStorage: MealPlanStorage = {
      ...storage,
      currentPlan: undefined
    }
    saveToStorage(newStorage)
  }, [storage, saveToStorage])

  // Get time remaining until expiration
  const getTimeUntilExpiration = useCallback((plan: SavedMealPlan) => {
    const now = new Date()
    const expires = new Date(plan.expiresAt)
    const diffMs = expires.getTime() - now.getTime()
    
    if (diffMs <= 0) return null
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes }
  }, [])

  return {
    storage,
    isLoaded,
    saveMealPlan,
    loadMealPlan,
    deleteMealPlan,
    updateCurrentPlan,
    clearCurrentPlan,
    getTimeUntilExpiration
  }
}