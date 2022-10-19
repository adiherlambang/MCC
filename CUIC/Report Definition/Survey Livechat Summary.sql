select DISTINCT 
convert(date, csr.created_at) as date,
COUNT(CASE WHEN csrd.rating=5 AND csrd.survey_question_uuid = -957686662 THEN 1 END) as 'Q1_Rate5',
COUNT(CASE WHEN csrd.rating=4 AND csrd.survey_question_uuid = -957686662 THEN 1 END) as 'Q1_Rate4',
COUNT(CASE WHEN csrd.rating=3 AND csrd.survey_question_uuid = -957686662 THEN 1 END) as 'Q1_Rate3',
COUNT(CASE WHEN csrd.rating=2 AND csrd.survey_question_uuid = -957686662 THEN 1 END) as 'Q1_Rate2',
COUNT(CASE WHEN csrd.rating=1 AND csrd.survey_question_uuid = -957686662 THEN 1 END) as 'Q1_Rate1',
COUNT(CASE WHEN csrd.rating=5 AND csrd.survey_question_uuid = 423369582 THEN 1 END) as 'Q2_Rate5',
COUNT(CASE WHEN csrd.rating=4 AND csrd.survey_question_uuid = 423369582 THEN 1 END) as 'Q2_Rate4',
COUNT(CASE WHEN csrd.rating=3 AND csrd.survey_question_uuid = 423369582 THEN 1 END) as 'Q2_Rate3',
COUNT(CASE WHEN csrd.rating=2 AND csrd.survey_question_uuid = 423369582 THEN 1 END) as 'Q2_Rate2',
COUNT(CASE WHEN csrd.rating=1 AND csrd.survey_question_uuid = 423369582 THEN 1 END) as 'Q2_Rate1',
COUNT(CASE WHEN csrd.rating=5 AND csrd.survey_question_uuid = -1831982249 THEN 1 END) as 'Q3_Rate5',
COUNT(CASE WHEN csrd.rating=4 AND csrd.survey_question_uuid = -1831982249 THEN 1 END) as 'Q3_Rate4',
COUNT(CASE WHEN csrd.rating=3 AND csrd.survey_question_uuid = -1831982249 THEN 1 END) as 'Q3_Rate3',
COUNT(CASE WHEN csrd.rating=2 AND csrd.survey_question_uuid = -1831982249 THEN 1 END) as 'Q3_Rate2',
COUNT(CASE WHEN csrd.rating=1 AND csrd.survey_question_uuid = -1831982249 THEN 1 END) as 'Q3_Rate1'
FROM livechat.guest.customer_survey_response_details csrd
JOIN livechat.guest.survey_questions sq on sq.uuid = csrd.survey_question_uuid 
JOIN livechat.guest.customer_survey_responses csr on csr.uuid = csrd.customer_survey_response_uuid 
WHERE csrd.survey_questionnaire_uuid = 1615927069
GROUP BY convert(date, csr.created_at)