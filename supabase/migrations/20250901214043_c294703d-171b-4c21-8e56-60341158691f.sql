-- Agregar columna order_index a la tabla notifications
ALTER TABLE public.notifications 
ADD COLUMN order_index INTEGER DEFAULT 0;

-- Actualizar todas las notificaciones existentes con un índice de orden basado en su fecha de creación
UPDATE public.notifications 
SET order_index = (
  SELECT ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1
  FROM public.notifications n2 
  WHERE n2.id = notifications.id
);

-- Crear índice para mejorar el rendimiento de las consultas por orden
CREATE INDEX IF NOT EXISTS idx_notifications_order_index ON public.notifications(order_index);