-- Create a view to access notion.pages data through the public schema
CREATE OR REPLACE VIEW public.restaurant_data AS 
SELECT id, title, attrs, created_at, last_edited_time as updated_at
FROM notion.pages;

-- Create RLS policy for the view
ALTER VIEW public.restaurant_data SET (security_invoker = true);

-- Grant access to the view
GRANT SELECT ON public.restaurant_data TO anon, authenticated;