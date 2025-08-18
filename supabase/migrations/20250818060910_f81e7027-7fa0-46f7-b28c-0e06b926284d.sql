-- Create a view in public schema to expose Notion pages to PostgREST
CREATE OR REPLACE VIEW public.restaurant_data
WITH (security_invoker = on) AS
SELECT 
  id,
  attrs,
  created_time,
  last_edited_time
FROM notion.pages
WHERE archived = false;

-- Grant read access to anon and authenticated roles
GRANT SELECT ON public.restaurant_data TO anon, authenticated;