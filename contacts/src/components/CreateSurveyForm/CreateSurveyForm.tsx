import React, { useState } from 'react';
import {useForm, useFieldArray, SubmitHandler, FieldPath, FieldPathValue, FieldArray} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {Button, Chip, Grid, TextField, Typography} from '@mui/material';
import {FileUpload} from '@mui/icons-material';

import { createSurvey } from '../../store/surveys/surveys.slice';

import "./createSurveyForm.css";
import {TCreateSurveyForm} from './createSurveyForm.types';

export const CreateSurveyForm = ({ handleClose }) => {
  const [inputTag, setInputTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const dispatch = useDispatch();
  const { isContractInit, currentAccount } = useSelector((state) => state.web3);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<TCreateSurveyForm>({
    defaultValues: {
      options: [{ id: '1', value: '' }, { id: '2', value: '' }],
    },
  });

  const getHelperMessageForTagsField = () => {
    if (inputTag.length > 20) {
      return 'Поле слишком большое';
    }
    if (inputTag.length) {
      return 'Введите больше символов'
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] || null);
  }

  const handleTagDelete = (index: number) => {
    setTags(tags.filter((tag, tagIndex) => tagIndex !== index));
  }

  const {fields, append, remove} = useFieldArray<TCreateSurveyForm>({
    control,
    name: 'options'
  } as any);

  const appendTag = (tag: string) => {
    if ((tag && tag.trim() !== "" && tags.length < 50 && tag.length <= 20 && tag.length >= 3)) {
      setTags([...tags, tag.toLowerCase()]);
      setValue('tags' as FieldPath<TCreateSurveyForm>, [...tags, tag] as  FieldPathValue<TCreateSurveyForm, "tags">);
      setInputTag('');
    }
  };

  const onSubmit: SubmitHandler<TCreateSurveyForm> = async (data) => {
    if (isContractInit && data.options.length >= 2 && data.options.length <= 10) {
      const question = data.question;
      const description = data.description;
      const tags = data.tags || [];
      const options = data.options.map((option) => option.text);

      dispatch(createSurvey({ question, description, options, tags, currentAccount }));
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)}>
      <div>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          1. Загрузите картинку для опроса:
        </Typography>

          <Button
            sx={{m:2}}
            color="secondary"
            variant="contained"
            component="span"
          >
            <FileUpload sx={{marginRight: 1}} />
            <span>Загрузить картинку</span>
            <input
              id="upload-image"
              type="file"
              name="imageFile"
              onChange={handleImageChange}
            />
          </Button>
      </div>

      <div>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          2. Ваш вопрос
        </Typography>
        <TextField
          sx={{m: 1}}
          id="outlined-basic"
          label="Вопрос?"
          variant="outlined"
          error={errors.question}
          fullWidth
          helperText={errors?.question?.message}
          type='text'
          {...register('question' as FieldPath<TCreateSurveyForm>, {
            required: { value: true, message: "Поле обязательно для заполнения"},
            minLength: { value: 3, message: "Введите больше символов" },
            maxLength: { value: 120, message: "Поле слишком большое" },
          })}
        />
      </div>

      <div>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          3. Описание
        </Typography>
        <TextField
          sx={{m: 1}}
          multiline
          rows={10}
          fullWidth
          label="Описание"
          variant="outlined"
          error={errors.description}
          helperText={errors?.description?.message}
          type='text'
          {...register('description' as FieldPath<TCreateSurveyForm>, {
            minLength: { value: 3, message: "Введите больше символов" },
            maxLength: { value: 800, message: "Поле слишком большое" },
          })}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <div>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          4. Варианты ответов:
        </Typography>
        <div >
          {fields.map((field, index) => (
            <Grid
              container
              spacing={2}
              key={field.id}
              alignItems='center'
            >
              <Grid
                item
                sm={12}
                md={10.5}
                xl={11}
              >
                <TextField
                  sx={{m: 1}}
                  label="Ответ"
                  variant="outlined"
                  error={errors?.options && errors?.options[index]}
                  helperText={errors?.options && errors?.options[index]?.text.message}
                  fullWidth
                  type='text'
                  {...register(`options.${index}.text` as FieldPath<TCreateSurveyForm>, {
                    required: { value: true, message: "Поле обязательно для заполнения"},
                    minLength: { value: 3, message: "Введите больше символов" },
                    maxLength: { value: 120, message: "Поле слишком большое" },
                  })}
                />
              </Grid>
              <Grid item sm={1}>
                {fields.length > 2 && (
                  <Button
                    type='button'
                    onClick={() => remove(index)}
                    color="error"
                    variant="contained"
                    component="span"
                    >
                  Удалить
                  </Button>
                )}
              </Grid>
            </Grid>
          ))}
        </div>

        {fields.length < 10 && (
          <Button
            sx={{m: 2}}
            type='button'
            onClick={() => append({ text: '' } as FieldArray<TCreateSurveyForm, string>)}
            variant="contained"
            component="span"
          >
            Добавить ответ
          </Button>
        )}
      </div>

      <div>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          5. Добавьте теги для поиска:
        </Typography>
        <Grid
          container
          spacing={1}
          alignItems='center'
          sx={{marginBottom: '10px'}}
        >
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              sx={{m:1}}
              disabled={tags.length >= 50}
              type='text'
              value={inputTag}
              onChange={e => setInputTag(e.target.value)}
              error={inputTag.length && (inputTag.length > 20 || inputTag.length < 3)}
              helperText={(inputTag.length > 20 || inputTag.length < 3) && getHelperMessageForTagsField()}
              onKeyDown={e => {
                if (e.key === 'Enter' && inputTag.length <= 20 && inputTag.length >= 3) {
                  e.preventDefault();
                  appendTag(inputTag);
                }
              }}
            />
          </Grid>
          {inputTag.trim() !== "" && (
            <Grid
              item
              xs={12}
              sm={4}
              md={2}
            >
              <Button
                disabled={tags.length >= 50}
                variant="outlined"
                type='button'
                onClick={() => appendTag(inputTag)}
                size='small'
              >
                Добавить тег
              </Button>
            </Grid>
          )}
        </Grid>

        {tags.map((tag, index) => (
          <Chip
            sx={{m:0.5}}
            label={tag}
            variant="filled"
            size='small'
            onDelete={() => handleTagDelete(index)}
            key={index}
          />
        ))}
      </div>

      <Button
        variant="contained"
        type='submit'
        color='secondary'
        float='right'
        size="large"
        className='createSurveyButton'
        sx={{m: 2}}
      >
        Создать опрос
      </Button>

    </form>
  )
};