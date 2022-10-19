SELECT 
CONVERT(date,csr.answered_at) as Date,
csr.ece_case_id  as Case_ID,
CONVERT (int,sq.uuid) as Survey_ID, 
sq.title as Survey_Title,
sq2.description  as Question,
csrd.explanation  as Explenation,
csrd.rating as Rating  
from livechat.guest.customer_survey_response_details csrd 
JOIN livechat.guest.customer_survey_responses csr on csr.uuid = csrd.customer_survey_response_uuid 
JOIN livechat.guest.survey_questionnaires sq on sq.uuid = csrd.survey_questionnaire_uuid 
JOIN livechat.guest.survey_questions sq2 on sq2.uuid  = csrd.survey_question_uuid 